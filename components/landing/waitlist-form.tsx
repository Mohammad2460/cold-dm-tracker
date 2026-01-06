"use client";

import { useState } from "react";
import { joinWaitlist, type WaitlistResult } from "@/app/actions/waitlist";

const SHARE_URL = "https://colddmtracker.com";
const SHARE_TEXT = "I just joined the waitlist for Cold DM Tracker - a simple tool to track cold DMs and never miss a follow-up! Join me:";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [position, setPosition] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email) return;

    setStatus("loading");

    const result: WaitlistResult = await joinWaitlist(email);

    if (result.success) {
      setStatus("success");
      setMessage(result.message);
      setPosition(result.position ?? null);
      setEmail("");
    } else {
      setStatus("error");
      setMessage(result.message);
    }
  }

  function shareOnTwitter() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function shareOnLinkedIn() {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-6 sm:p-8 max-w-lg mx-auto text-center">
        {/* Success header */}
        <div className="flex items-center justify-center gap-2 text-green-400 mb-4">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-xl font-semibold">You&apos;re on the list!</span>
        </div>
        
        {/* Position number */}
        {position && (
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-1">You&apos;re waitlist member</p>
            <p className="text-4xl sm:text-5xl font-bold text-white">#{position}</p>
          </div>
        )}
        
        {/* Launch date */}
        <p className="text-gray-300 mb-6">
          We&apos;ll email you on <span className="text-white font-medium">January 11, 2026</span> when Cold DM Tracker launches.
        </p>
        
        {/* Share section */}
        <div className="border-t border-white/10 pt-6 mt-6">
          <p className="text-sm text-gray-400 mb-4">
            💡 Want early access? Share this with 3 friends who do cold outreach:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Twitter/X button */}
            <button
              onClick={shareOnTwitter}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </button>
            
            {/* LinkedIn button */}
            <button
              onClick={shareOnLinkedIn}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Share on LinkedIn
            </button>
            
            {/* Copy link button */}
            <button
              onClick={copyLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 hover:border-white/20 transition-all"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy link
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Early bird note */}
        {position && position <= 50 && (
          <div className="mt-6 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-sm text-yellow-300">
              🎉 P.S. The first 50 users get lifetime 50% off. You&apos;re in!
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
        disabled={status === "loading"}
        required
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-xl bg-blue-500 px-8 py-3.5 text-sm font-medium text-white hover:bg-blue-400 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 btn-glow animate-pulse-glow"
      >
        {status === "loading" ? (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Joining...
          </span>
        ) : (
          "Join Waitlist"
        )}
      </button>
      {status === "error" && (
        <p className="text-red-400 text-sm mt-2 sm:absolute sm:bottom-[-28px] sm:left-0">{message}</p>
      )}
    </form>
  );
}
