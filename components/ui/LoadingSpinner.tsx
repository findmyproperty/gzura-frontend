'use client';

import React from 'react';

export default function LoadingSpinner({
  message = 'Loading...',
  light = false,
}: {
  message?: string;
  light?: boolean;
}) {
  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center ${light ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} p-4`}>
      <div className="relative flex flex-col items-center justify-center space-y-5">
        {/* Glowing aura rings */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-purple-600 blur-xl opacity-40 animate-pulse" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 p-0.5 shadow-2xl shadow-purple-900/50 animate-bounce">
            <div className="w-full h-full bg-purple-900/90 rounded-[14px] flex items-center justify-center border border-white/20">
              <span className="text-white font-extrabold text-2xl font-display tracking-wider">G</span>
            </div>
          </div>

          {/* Rotating spinner ring */}
          {/* <div className="absolute -inset-3 rounded-3xl border-2 border-transparent border-t-amber-400 border-r-purple-500 animate-spin" /> */}
        </div>

        {/* Brand Name & Subtext */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-extrabold font-display tracking-wider bg-gradient-to-r from-purple-900 via-purple-700 to-amber-600 bg-clip-text text-transparent dark:from-white dark:to-amber-300">
            GZURA
          </h2>
          <p className="text-xs font-semibold text-slate-400 tracking-widest uppercase animate-pulse">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
