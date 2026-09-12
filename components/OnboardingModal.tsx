'use client';

import React, { useState } from 'react';
import {
  X,
  QrCode,
  Box,
  Eye,
  Sliders,
  ArrowRight,
  ArrowLeft,
  Gamepad2,
  Sparkles
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    icon: Box,
    badge: 'STAGE 1 / 4',
    title: 'LOAD 3D ARCHITECTURAL MODEL',
    description:
      'Drag and drop any .glb or .gltf model from Rhino or Revit directly onto the arcade dropzone. Or select one of our preloaded architectural massing samples.',
    tip: 'Models are held in ephemeral RAM for 2 hours with zero persistent cloud archiving.',
    borderClass: 'border-arcade-cyan',
    badgeClass: 'bg-arcade-cyan text-black',
    accentText: 'text-arcade-cyan',
  },
  {
    icon: QrCode,
    badge: 'STAGE 2 / 4',
    title: 'SCAN DYNAMIC QR WITH PHONE',
    description:
      'Point any smartphone camera (iPhone iOS Safari or Android Chrome) at the on-screen arcade QR code. No app downloads, no TestFlight, and zero SSO login friction.',
    tip: 'Works across separate Wi-Fi or cellular networks via ephemeral session relay.',
    borderClass: 'border-arcade-yellow',
    badgeClass: 'bg-arcade-yellow text-black',
    accentText: 'text-arcade-yellow',
  },
  {
    icon: Eye,
    badge: 'STAGE 3 / 4',
    title: 'SURFACE ANCHORING IN REAL SPACE',
    description:
      'Tap [ VIEW IN YOUR SPACE (AR) ] on your mobile phone. Point your camera towards a floor, plaza, or conference table to anchor the 3D model in physical space.',
    tip: 'Utilizes native Apple AR Quick Look (LiDAR / ARKit) on iOS and SceneViewer / WebXR on Android.',
    borderClass: 'border-arcade-green',
    badgeClass: 'bg-arcade-green text-black',
    accentText: 'text-arcade-green',
  },
  {
    icon: Sliders,
    badge: 'STAGE 4 / 4',
    title: 'DUAL SCALE & SUNLIGHT CONTROLS',
    description:
      'Toggle between 1:1 Site Scale (for walking around full-scale massing on site) and Tabletop Mode (for miniature desktop design reviews). Dial the sun slider to match real lighting.',
    tip: 'Pinch to zoom and drag with two fingers to rotate the model freely.',
    borderClass: 'border-arcade-purple',
    badgeClass: 'bg-arcade-purple text-black',
    accentText: 'text-arcade-purple',
  },
];

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = STEPS[currentStep];
  const Icon = step.icon;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className={`relative w-full max-w-lg bg-arcade-dark border-3 ${step.borderClass} shadow-pixel-lg overflow-hidden flex flex-col`}>
        {/* Top Header */}
        <div className="p-4 border-b-2 border-arcade-border flex items-center justify-between bg-arcade-panel">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 font-pixel text-[10px] font-bold flex items-center gap-1.5 shadow-pixel-sm ${step.badgeClass}`}>
              <Gamepad2 className="w-3.5 h-3.5" />
              {step.badge}
            </span>
          </div>
          <button
            onClick={onClose}
            className="pixel-btn p-1 bg-arcade-dark text-arcade-red border border-arcade-border hover:bg-slate-800 transition"
            title="Close arcade guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 bg-arcade-dark/95">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 border-2 ${step.borderClass} bg-arcade-panel flex items-center justify-center shadow-pixel-sm shrink-0`}>
              <Icon className={`w-6 h-6 ${step.accentText}`} />
            </div>
            <div>
              <h3 className="font-pixel text-xs sm:text-sm text-slate-100 tracking-wide leading-relaxed">
                {step.title}
              </h3>
              <p className="font-arcade text-lg text-slate-400 tracking-wider mt-0.5">
                MISSION BRIEFING
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-mono leading-relaxed border-l-2 border-arcade-border pl-3">
            {step.description}
          </p>

          <div className="p-3 bg-arcade-panel/90 border border-arcade-border text-[11px] font-mono text-slate-300 flex items-start gap-2 shadow-inner">
            <Sparkles className={`w-4 h-4 ${step.accentText} shrink-0 mt-0.5`} />
            <div>
              <span className={`font-bold ${step.accentText}`}>PRO TIP: </span>
              {step.tip}
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 transition-all ${
                  idx === currentStep
                    ? `w-8 ${step.badgeClass}`
                    : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Go to stage ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="p-4 border-t-2 border-arcade-border bg-arcade-panel flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`pixel-btn px-3 py-2 font-pixel text-[10px] border flex items-center gap-1.5 ${
              currentStep === 0
                ? 'opacity-30 border-slate-700 text-slate-500 cursor-not-allowed'
                : 'border-slate-500 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            PREV
          </button>

          <button
            onClick={handleNext}
            className={`pixel-btn px-4 py-2 font-pixel text-[10px] border border-black shadow-pixel-sm flex items-center gap-2 font-bold ${
              currentStep === STEPS.length - 1
                ? 'bg-arcade-green text-black hover:bg-emerald-300'
                : 'bg-arcade-cyan text-black hover:bg-cyan-300'
            }`}
          >
            {currentStep === STEPS.length - 1 ? (
              <>START PLAYING [SPACE]</>
            ) : (
              <>
                NEXT STAGE
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
