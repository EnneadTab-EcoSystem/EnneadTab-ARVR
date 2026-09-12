'use client';

import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Box, 
  Smartphone, 
  UploadCloud, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Rotate3d, 
  Sparkles,
  Info,
  Layers
} from 'lucide-react';
import { FleetAttributionFooter } from '../components/FleetAttributionFooter';

const PRESET_MODELS = [
  {
    id: 'pavilion',
    name: 'Architectural Pavilion',
    desc: 'Organic canopy structure with steel ribs',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb',
    size: '1.2 MB'
  },
  {
    id: 'helmet',
    name: 'Spatial Anchor Prototype',
    desc: 'High-detail textured sample with PBR materials',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    size: '3.7 MB'
  },
  {
    id: 'lantern',
    name: 'Lighting & Lantern Mockup',
    desc: 'Translucent architectural fixture',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb',
    size: '1.9 MB'
  }
];

export default function DesktopHub() {
  const [roomId, setRoomId] = useState<string>('');
  const [modelUrl, setModelUrl] = useState<string>('');
  const [modelName, setModelName] = useState<string>('');
  const [modelSize, setModelSize] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [origin, setOrigin] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(randomId);
    setOrigin(window.location.origin);
    // Load default preset
    setModelUrl(PRESET_MODELS[0].url);
    setModelName(PRESET_MODELS[0].name);
    setModelSize(PRESET_MODELS[0].size);
  }, []);

  const mobileUrl = roomId ? `${origin}/arvr/view/${roomId}` : '';

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setModelName(file.name);
    setModelSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`/arvr/api/room/${roomId}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      setModelUrl(`/arvr/api/room/${roomId}?t=${Date.now()}`);
    } catch (err) {
      console.error(err);
      alert('Failed to process 3D model. Please ensure it is a valid .glb or .gltf file.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectPreset = async (preset: typeof PRESET_MODELS[0]) => {
    setUploading(true);
    setModelName(preset.name);
    setModelSize(preset.size);

    try {
      const res = await fetch(preset.url);
      const blob = await res.blob();
      const formData = new FormData();
      formData.append('file', blob, `${preset.id}.glb`);

      await fetch(`/arvr/api/room/${roomId}`, {
        method: 'POST',
        body: formData,
      });

      setModelUrl(`/arvr/api/room/${roomId}?t=${Date.now()}`);
    } catch (e) {
      console.error(e);
      setModelUrl(preset.url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 gap-6">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">EnneadTab-ARVR</h1>
                <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  WEBAR // ZERO-INSTALL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Zero-install mobile camera AR overlay for Rhino & Revit 3D architectural models
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ROOM: <strong className="text-white">{roomId || '...'}</strong>
            </div>
            <a
              href="https://enneadtab.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1"
            >
              EnneadTab Home <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </header>

        {/* Main Grid: 3-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          
          {/* Column 1: Model Source & Dropzone (4 cols) */}
          <section className="lg:col-span-4 flex flex-col gap-5">
            {/* Upload Dropzone */}
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-teal-500/60 bg-slate-900/50 hover:bg-slate-900 transition-all rounded-2xl p-6 text-center cursor-pointer group flex flex-col items-center justify-center gap-3"
            >
              <input 
                ref={fileInputRef} 
                type="file" 
                accept=".glb,.gltf" 
                className="hidden" 
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              />
              <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-teal-500/20 flex items-center justify-center text-slate-300 group-hover:text-teal-400 transition-colors">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {uploading ? 'Processing 3D Geometry...' : 'Drop Rhino / Revit .GLB here'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Or click to browse from workstation (.glb, .gltf)
                </p>
              </div>
            </div>

            {/* Preset Architectural Samples */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Instant Samples
                </span>
                <span className="text-[11px] text-slate-500">Click to test AR</span>
              </div>
              
              <div className="flex flex-col gap-2">
                {PRESET_MODELS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => selectPreset(preset)}
                    className={`text-left p-3 rounded-xl border transition-all flex items-start justify-between ${
                      modelName === preset.name
                        ? 'bg-teal-500/10 border-teal-500/50 text-white'
                        : 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-medium text-white">{preset.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{preset.desc}</div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {preset.size}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Workflow Guide */}
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 flex flex-col gap-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                <Info className="w-3.5 h-3.5 text-teal-400" /> 1-Click Export Tips
              </div>
              <p>
                <strong className="text-slate-300">Rhino 7/8:</strong> Select geometry &gt; <code className="text-teal-300 bg-slate-800 px-1 py-0.5 rounded">Export Selected</code> &gt; Save as <code className="text-teal-300">.glb</code>.
              </p>
              <p>
                <strong className="text-slate-300">Revit:</strong> Export 3D view via glTF converter plugin to preserve materials.
              </p>
              <p className="text-[11px] text-slate-500">
                Zero cloud persistence: All model data auto-purges after 2 hours TTL.
              </p>
            </div>
          </section>

          {/* Column 2: 3D Interactive Viewport (5 cols) */}
          <section className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col overflow-hidden relative min-h-[420px]">
            {/* Viewport Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/90 z-10">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-medium text-white truncate max-w-[200px]">
                  {modelName || 'Loading Model...'}
                </span>
                {modelSize && (
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    {modelSize}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                    autoRotate
                      ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                  title="Toggle Auto-Rotate"
                >
                  <Rotate3d className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">Spin</span>
                </button>
              </div>
            </div>

            {/* 3D Model Viewer Canvas */}
            <div className="flex-1 w-full h-full relative flex items-center justify-center">
              {modelUrl ? (
                <model-viewer
                  src={modelUrl}
                  alt={modelName}
                  camera-controls
                  touch-action="pan-y"
                  auto-rotate={autoRotate}
                  shadow-intensity="1"
                  shadow-softness="0.5"
                  exposure="1"
                  loading="eager"
                />
              ) : (
                <div className="text-center text-slate-500 text-xs">
                  Drop a 3D model to preview
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-950/60 border-t border-slate-800 text-center text-[11px] text-slate-400">
              Left-click: Orbit | Right-click: Pan | Scroll: Zoom
            </div>
          </section>

          {/* Column 3: Mobile Connect QR Code (3 cols) */}
          <section className="lg:col-span-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-between gap-6 text-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-medium mb-3">
                <Smartphone className="w-3.5 h-3.5" /> Mobile AR Connect
              </div>
              <h2 className="text-base font-bold text-white">Scan with Camera</h2>
              <p className="text-xs text-slate-400 mt-1">
                Point your iPhone or Android camera at the QR code to open the AR overlay.
              </p>
            </div>

            {/* QR Code Container */}
            <div className="p-4 bg-white rounded-2xl shadow-xl shadow-teal-500/5 border border-slate-200">
              {mobileUrl ? (
                <QRCodeSVG
                  value={mobileUrl}
                  size={180}
                  level="M"
                  includeMargin={false}
                />
              ) : (
                <div className="w-[180px] h-[180px] bg-slate-100 animate-pulse rounded-lg" />
              )}
            </div>

            {/* Instructions & Direct Link */}
            <div className="w-full flex flex-col gap-3">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-left">
                <div className="text-[11px] font-semibold text-slate-300 mb-1.5">How it works:</div>
                <ol className="text-[11px] text-slate-400 space-y-1 list-decimal list-inside">
                  <li>Scan QR with phone camera</li>
                  <li>Tap <strong className="text-teal-400">VIEW IN YOUR SPACE</strong></li>
                  <li>Aim camera at floor or table to anchor</li>
                </ol>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={copyUrl}
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-all"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>

                <a
                  href={mobileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 bg-teal-600 hover:bg-teal-500 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1 transition-all"
                  title="Open mobile view in new tab for testing"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Test
                </a>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Fleet Attribution Footer */}
      <FleetAttributionFooter />
    </div>
  );
}