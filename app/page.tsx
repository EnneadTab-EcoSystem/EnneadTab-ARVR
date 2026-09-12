'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Box, 
  Smartphone, 
  UploadCloud, 
  Check, 
  ExternalLink, 
  Copy, 
  Rotate3d, 
  Sparkles,
  Info,
  Layers,
  Gamepad2,
  Volume2,
  VolumeX,
  HelpCircle,
  Eye,
  Radio,
  Zap
} from 'lucide-react';
import { FleetAttributionFooter } from '../components/FleetAttributionFooter';
import OnboardingModal from '../components/OnboardingModal';

const PRESET_MODELS = [
  {
    id: 'pavilion',
    name: 'PAVILION CANOPY',
    desc: 'Steel rib canopy structure',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb',
    size: '1.2 MB',
    color: 'border-arcade-cyan text-arcade-cyan'
  },
  {
    id: 'helmet',
    name: 'SPATIAL ANCHOR',
    desc: 'Detailed PBR metallic massing',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    size: '3.7 MB',
    color: 'border-arcade-yellow text-arcade-yellow'
  },
  {
    id: 'lantern',
    name: 'LIGHTING FIXTURE',
    desc: 'Translucent architectural mock',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb',
    size: '1.9 MB',
    color: 'border-arcade-purple text-arcade-purple'
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
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 8-bit retro arcade chime synthesizer
  const playArcadeChime = useCallback((type: 'select' | 'drop' | 'copy') => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square'; // 8-bit authentic square wave

      if (type === 'drop') {
        // High ascending triad
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.16);
        osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.24);
      } else if (type === 'select') {
        // Double blip
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.07);
      } else {
        // Quick coin chime
        osc.frequency.setValueAtTime(987.77, ctx.currentTime);
        osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08);
      }

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.32);
    } catch {}
  }, [soundEnabled]);

  // Check first-time visit for onboarding & initialize session
  useEffect(() => {
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(randomId);
    setOrigin(window.location.origin);
    
    // Load default preset
    setModelUrl(PRESET_MODELS[0].url);
    setModelName(PRESET_MODELS[0].name);
    setModelSize(PRESET_MODELS[0].size);

    try {
      const seen = localStorage.getItem('enneadtab_arvr_onboarded');
      if (!seen) {
        setShowOnboarding(true);
      }
    } catch {}
  }, []);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    try {
      localStorage.setItem('enneadtab_arvr_onboarded', '1');
    } catch {}
    playArcadeChime('select');
  };

  const mobileUrl = roomId ? `${origin}/arvr/view/${roomId}` : '';

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setModelName(file.name.toUpperCase());
    setModelSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`/arvr/api/room/${roomId}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      setModelUrl(`/arvr/api/room/${roomId}?t=${Date.now()}`);
      playArcadeChime('drop');
    } catch (err) {
      console.error(err);
      alert('FAILED TO LOAD 3D MODEL. PLEASE SUPPLY A VALID .GLB OR .GLTF FILE.');
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
    playArcadeChime('copy');
    setTimeout(() => setCopied(false), 2000);
  };

  const selectPreset = async (preset: typeof PRESET_MODELS[0]) => {
    setUploading(true);
    setModelName(preset.name);
    setModelSize(preset.size);
    playArcadeChime('select');

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
    <div className="min-h-screen flex flex-col justify-between bg-arcade-dark arcade-scanlines text-slate-100 selection:bg-arcade-yellow selection:text-black">
      {/* Onboarding Arcade Modal */}
      <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />

      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 gap-6">
        {/* Top Header */}
        <header className="pixel-border bg-arcade-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-arcade-yellow bg-arcade-dark flex items-center justify-center text-arcade-yellow shadow-pixel-sm">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-pixel text-xs sm:text-sm text-arcade-yellow tracking-wider">
                  ENNEADTAB-ARVR
                </h1>
                <span className="px-1.5 py-0.5 font-pixel text-[9px] bg-arcade-green text-black font-bold">
                  v0.1.0
                </span>
                <span className="px-1.5 py-0.5 font-mono text-xs border border-arcade-border text-arcade-cyan">
                  ARCADE EDITION
                </span>
              </div>
              <p className="font-mono text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-arcade-green animate-pulse" />
                Zero-install mobile camera AR overlay for Rhino & Revit 3D models
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="pixel-btn p-2 border border-arcade-border bg-arcade-dark text-slate-300 hover:text-arcade-yellow"
              title={soundEnabled ? 'Mute 8-bit sound' : 'Enable 8-bit sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-arcade-green" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* How to play trigger */}
            <button
              onClick={() => setShowOnboarding(true)}
              className="pixel-btn px-3 py-1.5 border-2 border-arcade-cyan bg-arcade-dark text-arcade-cyan font-pixel text-[10px] flex items-center gap-1.5 hover:bg-slate-800"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              HOW TO PLAY
            </button>

            {/* Room ID Badge */}
            <div className="px-3 py-1.5 border border-arcade-border bg-arcade-dark flex items-center gap-2 text-xs">
              <span className="text-slate-500">ROOM:</span>
              <span className="font-pixel text-[11px] text-arcade-yellow tracking-wider">
                #{roomId || '------'}
              </span>
            </div>
          </div>
        </header>

        {/* Ephemeral Zero-Storage Warning Banner */}
        <div className="pixel-border-yellow bg-arcade-dark/95 p-3 flex items-start gap-3 text-xs font-mono">
          <Zap className="w-4 h-4 text-arcade-yellow shrink-0 mt-0.5 animate-pulse" />
          <div className="text-slate-300">
            <span className="font-bold text-arcade-yellow font-pixel text-[10px]">EPHEMERAL RAM BUFFER: </span>
            Models are held in temporary memory for 2 hours and purge automatically. Zero permanent project geometry is written to disk or database.
          </div>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: 3D Preview & Model Controls (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Viewport Box */}
            <div className="pixel-border bg-arcade-panel p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-arcade-border">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-arcade-green shadow-pixel-sm animate-ping" />
                  <span className="font-pixel text-[10px] text-slate-200">
                    DESKTOP 3D ORBIT VIEWPORT
                  </span>
                </div>
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`pixel-btn px-2.5 py-1 font-mono text-xs border flex items-center gap-1.5 ${
                    autoRotate 
                      ? 'border-arcade-green text-arcade-green bg-arcade-dark' 
                      : 'border-arcade-border text-slate-400 bg-arcade-dark'
                  }`}
                >
                  <Rotate3d className="w-3.5 h-3.5" />
                  AUTO-ROTATE: {autoRotate ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* 3D WebGL Canvas Viewport */}
              <div className="relative w-full h-[360px] sm:h-[420px] bg-arcade-dark border-2 border-arcade-border flex items-center justify-center overflow-hidden">
                {uploading && (
                  <div className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-4 border-arcade-yellow border-t-transparent animate-spin" />
                    <span className="font-pixel text-xs text-arcade-yellow">
                      STREAMING GEOMETRY...
                    </span>
                  </div>
                )}

                {modelUrl ? (
                  // @ts-ignore
                  <model-viewer
                    src={modelUrl}
                    alt="EnneadTab 3D Model View"
                    camera-controls
                    auto-rotate={autoRotate ? '' : undefined}
                    rotation-per-second="25deg"
                    shadow-intensity="1.2"
                    exposure="1.0"
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-500 font-mono">
                    <Box className="w-10 h-10 text-slate-600 stroke-1" />
                    <span className="font-pixel text-[10px]">NO MODEL LOADED</span>
                  </div>
                )}

                {/* Model Telemetry HUD */}
                <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1.5 bg-arcade-dark/90 border border-arcade-border font-mono text-[11px] text-slate-300 flex items-center gap-3 shadow-pixel-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">FILE:</span>
                    <span className="text-arcade-yellow font-bold truncate max-w-[160px]">
                      {modelName || 'UNTITLED'}
                    </span>
                  </div>
                  {modelSize && (
                    <div className="flex items-center gap-1 border-l border-arcade-border pl-3">
                      <span className="text-slate-500">SIZE:</span>
                      <span className="text-arcade-green font-bold">{modelSize}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="pixel-border border-dashed border-arcade-border hover:border-arcade-yellow bg-arcade-panel hover:bg-arcade-dark transition-all p-6 flex flex-col items-center justify-center text-center cursor-pointer group shadow-pixel"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".glb,.gltf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="w-12 h-12 border-2 border-arcade-border group-hover:border-arcade-yellow bg-arcade-dark flex items-center justify-center text-slate-400 group-hover:text-arcade-yellow transition shadow-pixel-sm mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="font-pixel text-xs text-slate-200 group-hover:text-arcade-yellow transition mb-1">
                [ INSERT 3D MODEL // DROP .GLB OR .GLTF ]
              </p>
              <p className="font-mono text-xs text-slate-400">
                Click or drag 3D files from Rhino, Revit, or Blender (Max 50MB)
              </p>
            </div>

            {/* Instant Architectural Presets */}
            <div className="pixel-border bg-arcade-panel p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-arcade-cyan" />
                <span className="font-pixel text-[10px] text-slate-300">
                  INSTANT ARCHITECTURAL PRESETS
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                {PRESET_MODELS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => selectPreset(preset)}
                    className={`pixel-btn p-3 bg-arcade-dark border text-left flex flex-col justify-between gap-1.5 transition ${
                      modelName === preset.name
                        ? `${preset.color} border-2 shadow-pixel-sm`
                        : 'border-arcade-border text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div>
                      <div className="font-pixel text-[9px] leading-tight mb-1 text-slate-100">
                        {preset.name}
                      </div>
                      <div className="text-[11px] text-slate-400 leading-snug">
                        {preset.desc}
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mt-1">
                      {preset.size}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Phone QR Code Bridge (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Main Pairing Box */}
            <div className="pixel-border-cyan bg-arcade-panel p-6 flex flex-col items-center text-center shadow-pixel-cyan">
              <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-arcade-border">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-arcade-cyan" />
                  <span className="font-pixel text-[10px] text-arcade-cyan">
                    MOBILE WEBAR BRIDGE
                  </span>
                </div>
                <span className="px-1.5 py-0.5 font-pixel text-[8px] bg-arcade-yellow text-black font-bold">
                  ZERO-INSTALL
                </span>
              </div>

              {/* Dynamic QR Code Frame */}
              <div className="p-4 bg-white border-3 border-black shadow-pixel-lg mb-4">
                {mobileUrl ? (
                  <QRCodeSVG
                    value={mobileUrl}
                    size={210}
                    level="M"
                    includeMargin={false}
                  />
                ) : (
                  <div className="w-[210px] h-[210px] bg-slate-200 flex items-center justify-center font-pixel text-[10px] text-black">
                    GENERATING QR...
                  </div>
                )}
              </div>

              {/* Instructions */}
              <h2 className="font-pixel text-xs text-arcade-yellow mb-2">
                POINT PHONE CAMERA AT QR
              </h2>
              <p className="font-mono text-xs text-slate-300 max-w-sm mb-4 leading-relaxed">
                Open Camera on iOS Safari or Android Chrome. Tap the notification banner to launch AR overlay in real space.
              </p>

              {/* Action Buttons */}
              <div className="w-full flex flex-col gap-2 font-mono text-xs">
                <button
                  onClick={copyUrl}
                  className="pixel-btn w-full py-2.5 px-3 bg-arcade-dark border border-arcade-border hover:border-arcade-yellow text-slate-200 flex items-center justify-center gap-2 shadow-pixel-sm"
                >
                  {copied ? <Check className="w-4 h-4 text-arcade-green" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  <span>{copied ? 'LINK COPIED TO CLIPBOARD' : 'COPY SESSION URL'}</span>
                </button>

                <a
                  href={mobileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-btn w-full py-2.5 px-3 bg-arcade-cyan text-black border border-black font-pixel text-[10px] flex items-center justify-center gap-2 font-bold shadow-pixel-sm hover:bg-cyan-300"
                >
                  <Eye className="w-4 h-4" />
                  <span>TEST MOBILE VIEW IN NEW TAB</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Rhino / Revit Exporter Instructions */}
            <div className="pixel-border bg-arcade-panel p-4 font-mono text-xs">
              <div className="flex items-center gap-2 font-pixel text-[10px] text-slate-300 pb-2 mb-3 border-b border-arcade-border">
                <Layers className="w-4 h-4 text-arcade-green" />
                <span>RHINO / REVIT 1-CLICK EXPORT</span>
              </div>
              <p className="text-slate-400 mb-2 leading-relaxed">
                Export selected massing directly from Rhino using our automated script:
              </p>
              <div className="p-2.5 bg-arcade-dark border border-arcade-border text-arcade-green font-mono text-[11px] overflow-x-auto select-all">
                python scripts/rhino_export_to_ar.py
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 6-Element Canonical Fleet Attribution Footer */}
      <FleetAttributionFooter currentVersion="0.1.0" />
    </div>
  );
}
