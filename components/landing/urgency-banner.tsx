"use client";

import { useState } from "react";

interface UrgencyBannerProps {
  spotsRemaining: number;
}

export function UrgencyBanner({ spotsRemaining }: UrgencyBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  // Don't show if dismissed or if all spots are taken
  if (dismissed || spotsRemaining <= 0) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500">
      <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-center relative">
        <p className="text-white text-xs sm:text-sm font-medium text-center pr-8 sm:pr-0">
          <span className="mr-1">⏰</span>
          <span className="hidden sm:inline">Early Access: Only 50 spots available</span>
          <span className="sm:hidden">Early Access</span>
          <span className="mx-2 text-white/60">|</span>
          <span className="font-bold">{spotsRemaining} spots remaining</span>
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-1 text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
          aria-label="Dismiss banner"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
