'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { 
  Camera, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Sun, 
  HelpCircle, 
  Box, 
  ArrowLeft,
  Share2
} from 'lucide-react';

export default function MobileARViewer() {
  const params = useParams();
  const roomId = (params?.roomId as string) || '';
  const [modelUrl, setModelUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ filename: string; size: number } | null>(null);
  const [scaleMode, setScaleMode] = useState<'1:1' | 'tabletop'>('tabletop');
  const [sunIntensity, setSunIntensity] = useState<number>(1.0);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const modelViewerRef = useRef<any>(null);

  useEffect(() => {
    if (!roomId) return;

    fetch(`/arvr/api/room/${roomId}?meta=1`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Room session not found or expired.');
        }
        const data = await res.json();
        setMeta(data);
        setModelUrl(`/arvr/api/room/${roomId}`);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Metadata fetch failed, falling back to direct stream:', err);
        setModelUrl(`/arvr/api/room/${roomId}`);
        setLoading(false);
      });
  }, [roomId]);

  const toggleScale = () => {
    const nextMode = scaleMode === 'tabletop' ? '1:1' : 'tabletop';
    setScaleMode(nextMode);
    if (modelViewerRef.current) {
      if (nextMode === '1:1') {
        modelViewerRef.current.scale = '1 1 1';
        modelViewerRef.current.setAttribute('ar-scale', 'fixed');
      } else {
        modelViewerRef.current.scale = '0.1 0.1 0.1';
        modelViewerRef.current.setAttribute('ar-scale', 'auto');
      }
    }
  };

  const resetCamera = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.cameraOrbit = '0deg 75deg 105%';
      modelViewerRef.current.resetTurntableRotation();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EnneadTab AR Model',
          text: `View 3D Model in Augmented Reality (Room: ${roomId})`,
          url: window.location.href,
        });
      } catch {
        // Ignored
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="relative w-screen h-[100dvh] bg-[#070a10] flex flex-col overflow-hidden select-none">
      {/* Top Floating Control Bar */}
      <header className="absolute top-0 left-0 right-0 z-30 p-3 sm:p-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <a
            href="/arvr"
            className="w-9 h-9 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-lg active:scale-95"
            title="Return to Desktop Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </a>
          <div className="px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 flex items-center gap-2 shadow-lg text-xs font-mono text-slate-200">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>ROOM: <strong>{roomId}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setShowHelp(true)}
            className="w-9 h-9 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-lg active:scale-95"
            title="AR Instructions"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-lg active:scale-95"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main 3D Model / WebAR Canvas */}
      <div className="flex-1 w-full h-full relative">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium tracking-wide">STREAMING 3D GEOMETRY...</p>
          </div>
        ) : error ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <Box className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-semibold text-white">Session Unavailable</h2>
            <p className="text-xs text-slate-400 max-w-xs">{error}</p>
            <a
              href="/arvr"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-medium text-white border border-slate-700"
            >
              Return to Desktop Hub
            </a>
          </div>
        ) : (
          <model-viewer
            ref={modelViewerRef}
            src={modelUrl}
            alt={meta?.filename || '3D Architecture Model'}
            ar
            ar-modes="webxr scene-viewer quick-look"
            ar-scale={scaleMode === '1:1' ? 'fixed' : 'auto'}
            camera-controls
            touch-action="pan-y"
            auto-rotate
            shadow-intensity="1.2"
            shadow-softness="0.6"
            exposure={sunIntensity}
            loading="eager"
            reveal="auto"
          >
            <button
              slot="ar-button"
              className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-black font-bold text-sm tracking-wide shadow-2xl shadow-teal-500/40 hover:scale-105 active:scale-95 transition-all"
            >
              <Camera className="w-5 h-5" />
              VIEW IN YOUR SPACE (AR)
            </button>
          </model-viewer>
        )}
      </div>

      {/* Bottom Floating Control Pill */}
      <footer className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between gap-3 pointer-events-none">
        <button
          onClick={toggleScale}
          className="pointer-events-auto px-3.5 py-2 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-xl flex items-center gap-2 text-xs font-semibold text-white active:scale-95 transition-all"
        >
          {scaleMode === '1:1' ? <Maximize2 className="w-3.5 h-3.5 text-teal-400" /> : <Minimize2 className="w-3.5 h-3.5 text-teal-400" />}
          <span>{scaleMode === '1:1' ? '1:1 Site Scale' : 'Tabletop Mode'}</span>
        </button>

        <button
          onClick={resetCamera}
          className="pointer-events-auto p-2.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-xl text-slate-300 hover:text-white active:scale-95 transition-all"
          title="Reset 3D View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => setSunIntensity((prev) => (prev >= 1.5 ? 0.7 : prev + 0.4))}
          className="pointer-events-auto p-2.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-xl text-slate-300 hover:text-white active:scale-95 transition-all"
          title="Adjust Sunlight / Exposure"
        >
          <Sun className="w-4 h-4 text-amber-400" />
        </button>
      </footer>

      {/* Help Modal */}
      {showHelp && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm p-6 flex items-center justify-center">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full flex flex-col gap-4 text-slate-300">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-teal-400" /> How to use Mobile AR
            </h3>
            
            <ol className="text-xs space-y-2.5 list-decimal list-inside text-slate-400">
              <li>Tap <strong className="text-teal-400">VIEW IN YOUR SPACE</strong>.</li>
              <li>Point your phone camera toward a flat floor, table, or ground.</li>
              <li>Slowly move your camera in circular motions so the phone senses plane depth.</li>
              <li>Tap the surface once plane is recognized to anchor your model.</li>
              <li>Pinch to resize, two-finger drag to rotate, or switch to 1:1 scale.</li>
            </ol>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full py-2.5 mt-2 bg-teal-600 hover:bg-teal-500 rounded-xl text-xs font-semibold text-white transition-colors"
            >
              Got it, let's go
            </button>
          </div>
        </div>
      )}
    </div>
  );
}