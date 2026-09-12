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
  Share2,
  Gamepad2,
  Zap,
  Check,
  X
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
  const [copied, setCopied] = useState<boolean>(false);
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative w-screen h-[100dvh] bg-arcade-dark arcade-scanlines flex flex-col overflow-hidden select-none text-slate-100">
      {/* Top Floating Arcade Control Bar */}
      <header className="absolute top-0 left-0 right-0 z-30 p-3 sm:p-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <a
            href="/arvr"
            className="pixel-btn p-2 border-2 border-arcade-border bg-arcade-dark/95 text-slate-300 hover:text-arcade-yellow shadow-pixel-sm flex items-center justify-center"
            title="Return to Desktop Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </a>
          <div className="px-2.5 py-1.5 border-2 border-arcade-border bg-arcade-dark/95 flex items-center gap-2 shadow-pixel-sm text-xs font-mono">
            <span className="w-2 h-2 bg-arcade-green animate-pulse" />
            <span className="font-pixel text-[9px] text-arcade-yellow">ROOM #{roomId}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setShowHelp(true)}
            className="pixel-btn px-2.5 py-1.5 border-2 border-arcade-cyan bg-arcade-dark/95 text-arcade-cyan font-pixel text-[9px] flex items-center gap-1.5 shadow-pixel-sm"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            HELP
          </button>
          <button
            onClick={handleShare}
            className="pixel-btn p-2 border-2 border-arcade-border bg-arcade-dark/95 text-slate-300 hover:text-white shadow-pixel-sm"
            title="Share AR Session"
          >
            {copied ? <Check className="w-4 h-4 text-arcade-green" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Viewport Container */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-arcade-yellow border-t-transparent animate-spin" />
            <p className="font-pixel text-xs text-arcade-yellow tracking-wider">
              LOADING 3D GEOMETRY...
            </p>
          </div>
        ) : error ? (
          <div className="p-6 bg-arcade-panel border-3 border-arcade-red max-w-xs text-center flex flex-col items-center gap-3 shadow-pixel">
            <span className="font-pixel text-xs text-arcade-red">SESSION EXPIRED</span>
            <p className="font-mono text-xs text-slate-400 leading-relaxed">
              {error}
            </p>
            <a
              href="/arvr"
              className="pixel-btn px-4 py-2 border-2 border-black bg-arcade-yellow text-black font-pixel text-[10px] font-bold shadow-pixel-sm"
            >
              RETURN TO HUB
            </a>
          </div>
        ) : (
          // @ts-ignore
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
            {/* Native AR Launcher Button */}
            <button
              slot="ar-button"
              className="ar-button-prompt absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5"
            >
              <Camera className="w-4 h-4" />
              VIEW IN YOUR SPACE (AR)
            </button>
          </model-viewer>
        )}
      </div>

      {/* Bottom Floating Control Bar */}
      <footer className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between gap-2 pointer-events-none">
        <button
          onClick={toggleScale}
          className="pixel-btn pointer-events-auto px-3.5 py-2.5 bg-arcade-panel border-3 border-arcade-border text-slate-100 font-pixel text-[10px] shadow-pixel flex items-center gap-2 hover:border-arcade-yellow"
        >
          {scaleMode === '1:1' ? <Maximize2 className="w-3.5 h-3.5 text-arcade-cyan" /> : <Minimize2 className="w-3.5 h-3.5 text-arcade-cyan" />}
          <span>{scaleMode === '1:1' ? '1:1 SITE SCALE' : 'TABLETOP MODE'}</span>
        </button>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={resetCamera}
            className="pixel-btn p-2.5 bg-arcade-panel border-3 border-arcade-border shadow-pixel text-slate-300 hover:text-white"
            title="Reset 3D Turntable Camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSunIntensity((prev) => (prev >= 1.5 ? 0.7 : prev + 0.4))}
            className="pixel-btn p-2.5 bg-arcade-panel border-3 border-arcade-border shadow-pixel text-arcade-yellow"
            title="Adjust Sun Intensity"
          >
            <Sun className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* Arcade Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-150">
          <div className="bg-arcade-dark border-3 border-arcade-cyan shadow-pixel-cyan p-5 max-w-sm w-full flex flex-col gap-4 text-slate-200">
            <div className="flex items-center justify-between border-b-2 border-arcade-border pb-3">
              <span className="px-2 py-0.5 font-pixel text-[9px] bg-arcade-cyan text-black font-bold flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5" />
                HOW TO PLAY (AR)
              </span>
              <button
                onClick={() => setShowHelp(false)}
                className="pixel-btn p-1 bg-arcade-panel text-arcade-red border border-arcade-border"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <ol className="text-xs font-mono space-y-3 list-decimal list-inside text-slate-300 leading-relaxed border-l-2 border-arcade-border pl-2">
              <li>Tap <strong className="text-arcade-green font-pixel text-[10px]">VIEW IN YOUR SPACE</strong>.</li>
              <li>Point camera at a flat floor, plaza, or table.</li>
              <li>Slowly pan in gentle circles to detect plane anchors.</li>
              <li>Tap surface to lock the 3D model in place.</li>
              <li>Toggle <strong className="text-arcade-cyan">1:1 SITE SCALE</strong> for full walkaround.</li>
            </ol>

            <button
              onClick={() => setShowHelp(false)}
              className="pixel-btn w-full py-2.5 mt-2 bg-arcade-green text-black border border-black font-pixel text-[10px] font-bold shadow-pixel-sm hover:bg-emerald-300"
            >
              MISSION READY [OK]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
