import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const homeErrorDumpUrl = process.env.ERROR_DUMP_URL || 'https://enneadtab.com/api/report-error';
    await fetch(homeErrorDumpUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...body,
        product: 'EnneadTab-ARVR',
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 200 }); // fail-open
  }
}