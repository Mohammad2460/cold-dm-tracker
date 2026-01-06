import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { WaitlistForm } from "@/components/landing/waitlist-form";
import { UrgencyBanner } from "@/components/landing/urgency-banner";
import { getWaitlistCount } from "@/app/actions/waitlist";

export default async function LandingPage() {
  const { userId } = await auth();

  // Authenticated users go to dashboard
  if (userId) {
    redirect("/dashboard");
  }

  // Get live waitlist count
  const waitlistCount = await getWaitlistCount();
  const showSocialProof = waitlistCount >= 5;
  const displayCount = waitlistCount > 50 ? "50+" : waitlistCount.toString();
  const spotsRemaining = Math.max(0, 50 - waitlistCount);

  return (
    <div className="min-h-screen bg-[#09090b] text-white antialiased overflow-x-hidden relative z-10 bg-grid">
      {/* Urgency Banner */}
      <UrgencyBanner spotsRemaining={spotsRemaining} />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#09090b] transition-all duration-300" style={{ top: "36px" }}>
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-center">
          <span className="text-lg font-bold tracking-tight">Cold DM Tracker</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 sm:pt-40 md:pt-48 pb-16 sm:pb-24 md:pb-32 px-4 sm:px-6 relative">
        {/* Glow effect */}
        <div className="hero-glow" />

        <div className="mx-auto max-w-3xl text-center relative z-10">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-gray-400 mb-6 sm:mb-8 animate-fade-in-up">
            For freelancers, salespeople & creators
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-4 sm:mb-6 px-4 animate-fade-in-up animation-delay-100">
            Stop Losing Deals to
            <br />
            <span className="text-gradient">Forgotten Follow-Ups</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4 animate-fade-in-up animation-delay-200">
            Track every cold DM you send. Get reminded when to follow up.
            Never let a potential client slip through the cracks again.
          </p>
          <div className="animate-fade-in-up animation-delay-300 px-4">
            <WaitlistForm />
          </div>
          
          {/* Launch Announcement */}
          <div className="mt-4 sm:mt-5 animate-fade-in-up animation-delay-350 px-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-gray-300">
              <span>🚀</span>
              <span>Launching January 11, 2026</span>
              <span className="text-gray-500">|</span>
              <span className="text-blue-400 font-medium">Join the first 50 users</span>
            </span>
          </div>
          
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 animate-fade-in-up animation-delay-400">
            14-day free trial &bull; No credit card required &bull; Cancel anytime
          </p>

          {/* Social proof with avatars */}
          {showSocialProof && (
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 animate-fade-in-up animation-delay-400 px-4">
              <div className="flex items-center">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#09090b] object-cover" />
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#09090b] object-cover -ml-2" />
                <img src="https://randomuser.me/api/portraits/men/67.jpg" alt="" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#09090b] object-cover -ml-2" />
                <img src="https://randomuser.me/api/portraits/women/17.jpg" alt="" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#09090b] object-cover -ml-2" />
                <img src="https://randomuser.me/api/portraits/men/52.jpg" alt="" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#09090b] object-cover -ml-2" />
              </div>
              <span className="text-xs sm:text-sm text-gray-400 text-center">
                Join <span className="text-white font-medium">{displayCount}</span> people already on the waitlist
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-14 md:mb-16 px-4">
            Sound Familiar?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="card-neumorphic rounded-[30px] p-6 sm:p-8 relative quote-card card-hover">
              <p className="text-gray-300 leading-relaxed text-base sm:text-lg pt-4">
                You sent a great DM last week... but forgot to follow up
              </p>
            </div>
            <div className="card-neumorphic rounded-[30px] p-6 sm:p-8 relative quote-card card-hover">
              <p className="text-gray-300 leading-relaxed text-base sm:text-lg pt-4">
                You&apos;re juggling LinkedIn, Twitter, Instagram DMs with no system
              </p>
            </div>
            <div className="card-neumorphic rounded-[30px] p-6 sm:p-8 relative quote-card card-hover">
              <p className="text-gray-300 leading-relaxed text-base sm:text-lg pt-4">
                You know follow-ups close deals, but you can&apos;t keep track
              </p>
            </div>
          </div>
          <p className="text-center text-gray-400 mt-10 sm:mt-12 md:mt-14 text-lg sm:text-xl px-4">
            You&apos;re not lazy. <span className="text-white">You just need a system.</span>
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 md:mb-20 px-4">
            Your Follow-Up System in 30 Seconds
          </h2>
          <div className="grid md:grid-cols-3 gap-10 sm:gap-12 relative">
            {/* Connector lines - visible on desktop */}
            <div className="hidden md:block absolute top-6 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-[2px]">
              <div className="w-full h-full border-t-2 border-dashed border-white/10" />
            </div>

            <div className="text-center relative z-10 px-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-5 sm:mb-6 text-lg sm:text-xl font-bold text-white shadow-lg shadow-blue-500/25">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Log Your DM</h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                Add who you messaged, where, and when to follow up
              </p>
            </div>
            <div className="text-center relative z-10 px-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-5 sm:mb-6 text-lg sm:text-xl font-bold text-white shadow-lg shadow-purple-500/25">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Get Reminded</h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                Receive a daily email at 8:30 AM with your follow-ups for the day
              </p>
            </div>
            <div className="text-center relative z-10 px-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-5 sm:mb-6 text-lg sm:text-xl font-bold text-white shadow-lg shadow-green-500/25">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Close More Deals</h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                Never miss an opportunity. Stay on top of every conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-14 md:mb-16 px-4">
            Everything You Need. Nothing You Don&apos;t.
          </h2>
          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 card-hover">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl icon-blue flex items-center justify-center mb-4 sm:mb-5">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Daily Email Reminders</h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                Wake up knowing exactly who to follow up with today
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 card-hover">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl icon-purple flex items-center justify-center mb-4 sm:mb-5">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Multi-Platform Tracking</h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                LinkedIn, Twitter, Instagram, Email &ndash; all in one place
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 card-hover">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl icon-green flex items-center justify-center mb-4 sm:mb-5">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Smart Dashboard</h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                See today&apos;s follow-ups, overdue DMs, and your entire pipeline
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 card-hover">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl icon-orange flex items-center justify-center mb-4 sm:mb-5">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Simple & Fast</h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                Add a DM in 10 seconds. No complex CRM setup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why I Built This Section */}
      <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 border-t border-white/5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">
            Why I Built This
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mb-8 sm:mb-10">
            Built by Mohammad, a student founder
          </p>
          
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 text-left">
            <p className="text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">
              &ldquo;I lost over <span className="text-white font-semibold">$10,000</span> last year because I forgot to follow up with interested prospects. Some replied saying yes, and I just... forgot about them.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">
              So I built Cold DM Tracker. Not as a fancy CRM. Just a simple system to make sure I never lose another opportunity to bad memory.
            </p>
            <p className="text-gray-300 leading-relaxed mb-6 text-sm sm:text-base">
              If this sounds like you, join the waitlist.&rdquo;
            </p>
            
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                M
              </div>
              <div>
                <p className="text-white font-medium text-sm">Mohammad</p>
                <a 
                  href="https://twitter.com/SaaSbyMohd" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors inline-flex items-center gap-1"
                >
                  @SaaSbyMohd
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-14 md:mb-16 px-4">
            Built For People Who Do Outreach
          </h2>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-6 sm:p-8 rounded-2xl border border-transparent hover:border-white/10 transition-all duration-300">
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">💼</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Freelancers</h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                Land more clients by following up consistently
              </p>
            </div>
            <div className="text-center p-6 sm:p-8 rounded-2xl border border-transparent hover:border-white/10 transition-all duration-300">
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">📈</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Salespeople</h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                Never let a lead go cold again
              </p>
            </div>
            <div className="text-center p-6 sm:p-8 rounded-2xl border border-transparent hover:border-white/10 transition-all duration-300">
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">🎨</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Creators</h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                Build relationships that grow your audience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 px-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center text-gray-400 mb-10 sm:mb-14 text-sm sm:text-base">
            Start free, upgrade when you need more
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8">
            {/* Free Plan */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Free</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl sm:text-4xl font-bold">$0</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 text-sm sm:text-base text-gray-300">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Track up to 10 DMs
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  1 platform
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Basic reminders
                </li>
              </ul>
            </div>
            
            {/* Pro Plan */}
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-6 sm:p-8 relative">
              <div className="absolute -top-3 left-6 px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                POPULAR
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Pro</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl sm:text-4xl font-bold">$5</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 text-sm sm:text-base text-gray-300">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong className="text-white">Unlimited</strong> DMs</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  All platforms
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Daily email reminders
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
              </ul>
            </div>
          </div>
          
          {/* Early Access Special */}
          <div className="rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 p-6 sm:p-8 text-center">
            <div className="inline-flex items-center gap-2 text-yellow-400 font-semibold mb-3">
              <span className="text-xl">🎁</span>
              <span>Early Access Special (First 50 Users)</span>
            </div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-3xl sm:text-4xl font-bold text-white">$2.50</span>
              <span className="text-gray-400">/month</span>
              <span className="text-sm line-through text-gray-500">$5</span>
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-semibold rounded">50% OFF</span>
            </div>
            <p className="text-yellow-300/80 text-sm font-medium">
              Lock in this price forever — no price increases, ever.
            </p>
          </div>
          
          <p className="text-center text-gray-500 text-sm mt-6">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* Early Access Perks Section */}
      <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 border-t border-white/5 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
        
        <div className="mx-auto max-w-4xl relative z-10">
          {/* Spots remaining badge */}
          <div className="flex justify-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 sm:px-5 py-2 sm:py-2.5 animate-pulse-glow">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
              </span>
              <span className="text-sm sm:text-base font-semibold text-orange-300">
                🔥 {spotsRemaining}/50 spots remaining
              </span>
            </div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 px-4">
            Early Access Perks
          </h2>
          <p className="text-center text-blue-300/80 font-medium mb-10 sm:mb-14 text-sm sm:text-base">
            ⭐ First 50 Users Only ⭐
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="group rounded-2xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm p-5 sm:p-6 hover:border-blue-500/40 hover:bg-blue-500/10 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="text-3xl sm:text-4xl">🎁</div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">Lifetime 50% Off</h3>
                  <p className="text-sm sm:text-base text-gray-400">
                    <span className="text-green-400 font-bold">$2.50/month</span> instead of <span className="line-through text-gray-500">$5/month</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group rounded-2xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm p-5 sm:p-6 hover:border-blue-500/40 hover:bg-blue-500/10 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="text-3xl sm:text-4xl">🎯</div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">Direct Founder Access</h3>
                  <p className="text-sm sm:text-base text-gray-400">
                    Request features directly & get heard
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group rounded-2xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm p-5 sm:p-6 hover:border-blue-500/40 hover:bg-blue-500/10 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="text-3xl sm:text-4xl">🚀</div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">Shape the Roadmap</h3>
                  <p className="text-sm sm:text-base text-gray-400">
                    Help decide what features we build next
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group rounded-2xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm p-5 sm:p-6 hover:border-blue-500/40 hover:bg-blue-500/10 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="text-3xl sm:text-4xl">⏰</div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">Priority Support</h3>
                  <p className="text-sm sm:text-base text-gray-400">
                    Get updates first & dedicated help
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Urgency CTA */}
          <div className="mt-10 sm:mt-12 text-center">
            <a href="#waitlist" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors group">
              <span>Claim your spot now</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 border-t border-white/5 scroll-mt-20 relative">
        <div className="hero-glow opacity-50" />
        <div className="mx-auto max-w-xl text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">
            Get Early Access
          </h2>
          <p className="text-sm sm:text-base text-gray-400 mb-8 sm:mb-10 px-4">
            Join the waitlist and be the first to know when we launch new features.
          </p>
          <div className="px-4">
            <WaitlistForm />
          </div>
          <p className="mt-5 sm:mt-6 text-xs sm:text-sm text-gray-500 px-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-white/5">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="text-xs sm:text-sm text-gray-500">
            Cold DM Tracker &copy; 2026
          </div>
          <a
            href="https://twitter.com/SaaSbyMohd"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
          >
            Twitter
          </a>
        </div>
      </footer>
    </div>
  );
}
