import { NextRequest, NextResponse } from 'next/server';

interface RoomData {
  modelBuffer: Buffer;
  filename: string;
  contentType: string;
  size: number;
  createdAt: number;
}

const globalRooms = (global as unknown as { __arvrRooms?: Map<string, RoomData> });
if (!globalRooms.__arvrRooms) {
  globalRooms.__arvrRooms = new Map<string, RoomData>();
}
const rooms = globalRooms.__arvrRooms;

function cleanupExpired() {
  const now = Date.now();
  for (const [id, data] of rooms.entries()) {
    if (now - data.createdAt > 2 * 60 * 60 * 1000) {
      rooms.delete(id);
    }
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  cleanupExpired();
  const { roomId } = params;
  const data = rooms.get(roomId);

  if (!data) {
    return NextResponse.json(
      { error: 'Room or model not found or session expired.' },
      { status: 404 }
    );
  }

  const url = new URL(req.url);
  if (url.searchParams.get('meta') === '1') {
    return NextResponse.json({
      roomId,
      filename: data.filename,
      size: data.size,
      contentType: data.contentType,
      createdAt: data.createdAt,
    });
  }

  return new NextResponse(new Uint8Array(data.modelBuffer), {
    status: 200,
    headers: {
      'Content-Type': data.contentType || 'model/gltf-binary',
      'Content-Length': data.size.toString(),
      'Content-Disposition': `inline; filename="${data.filename}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  cleanupExpired();
  const { roomId } = params;

  try {
    const contentType = req.headers.get('content-type') || '';
    let buffer: Buffer;
    let filename = `model-${roomId}.glb`;
    let mime = 'model/gltf-binary';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }
      filename = file.name || filename;
      mime = file.type || (filename.endsWith('.usdz') ? 'model/vnd.usdz+zip' : 'model/gltf-binary');
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      const arrayBuffer = await req.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    if (buffer.length === 0) {
      return NextResponse.json({ error: 'Empty file payload' }, { status: 400 });
    }

    rooms.set(roomId, {
      modelBuffer: buffer,
      filename,
      contentType: mime,
      size: buffer.length,
      createdAt: Date.now(),
    });

    return NextResponse.json({
      success: true,
      roomId,
      filename,
      size: buffer.length,
      downloadUrl: `/api/room/${roomId}`,
    });
  } catch (err: unknown) {
    console.error('Upload error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    );
  }
}