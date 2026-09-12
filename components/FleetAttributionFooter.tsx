'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

export const APP_VERSION = '0.1.0';
export const APP_SLUG = 'arvr';

export function FleetAttributionFooter({ className = '', currentVersion = APP_VERSION }: { className?: string; currentVersion?: string }) {
  const currentYear = new Date().getFullYear();
  const feedbackUrl = `https://enneadtab.com/wiki/feature-requests/new?source=${APP_SLUG}&version=${currentVersion}`;

  return (
    <footer className={`w-full border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-400 select-none ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 font-normal">
        <span className="text-slate-300">
          Created by SenZhang, powered by EnneadTab @{currentYear}
        </span>
        <span className="text-slate-600 hidden sm:inline">·</span>
        <a
          href="https://enneadtab.com"
          target="_blank"
          rel="noreferrer"
          className="text-teal-400 hover:text-teal-300 hover:underline flex items-center gap-1 transition-colors"
        >
          EnneadTab Home <ExternalLink className="w-3 h-3 inline opacity-70" />
        </a>
        <span className="text-slate-600 hidden sm:inline">·</span>
        <a
          href="/arvr"
          className="text-slate-300 hover:text-white transition-colors"
        >
          EnneadTab-ARVR
        </a>
        <span className="text-slate-600 hidden sm:inline">·</span>
        <a
          href={feedbackUrl}
          target="_blank"
          rel="noreferrer"
          className="text-slate-300 hover:text-white hover:underline transition-colors"
        >
          Feedback
        </a>
        <span className="text-slate-600 hidden sm:inline">·</span>
        <span className="font-mono text-[11px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
          v{APP_VERSION}
        </span>
      </div>
    </footer>
  );
}