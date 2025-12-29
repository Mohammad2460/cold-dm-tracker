import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { WaitlistForm } from "@/components/landing/waitlist-form";

export default async function LandingPage() {
  const { userId } = await auth();

  // Authenticated users go to dashboard
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white antialiased overflow-x-hidden relative bg-grid">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-center">
          <span className="text-lg font-bold tracking-tight">Cold DM Tracker</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-6 relative">
        {/* Glow effect */}
        <div className="hero-glow" />

        <div className="mx-auto max-w-3xl text-center relative z-10">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400 mb-8 animate-fade-in-up">
            For freelancers, salespeople & creators
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 animate-fade-in-up animation-delay-100">
            Stop Losing Deals to
            <br />
            <span className="text-gradient">Forgotten Follow-Ups</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up animation-delay-200">
            Track every cold DM you send. Get reminded when to follow up.
            Never let a potential client slip through the cracks again.
          </p>
          <div className="animate-fade-in-up animation-delay-300">
            <WaitlistForm />
          </div>
          <p className="mt-4 text-sm text-gray-500 animate-fade-in-up animation-delay-400">
            Free while in beta &bull; No credit card required
          </p>

          {/* Social proof with avatars */}
          <div className="mt-10 flex items-center justify-center gap-3 animate-fade-in-up animation-delay-400">
            <div className="flex items-center">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="" className="w-8 h-8 rounded-full border-2 border-[#09090b] object-cover" />
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="" className="w-8 h-8 rounded-full border-2 border-[#09090b] object-cover -ml-2" />
              <img src="https://randomuser.me/api/portraits/men/67.jpg" alt="" className="w-8 h-8 rounded-full border-2 border-[#09090b] object-cover -ml-2" />
              <img src="https://randomuser.me/api/portraits/women/17.jpg" alt="" className="w-8 h-8 rounded-full border-2 border-[#09090b] object-cover -ml-2" />
              <img src="https://randomuser.me/api/portraits/men/52.jpg" alt="" className="w-8 h-8 rounded-full border-2 border-[#09090b] object-cover -ml-2" />
            </div>
            <span className="text-sm text-gray-400">
              Join <span className="text-white font-medium">50+</span> professionals tracking their outreach
            </span>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-28 px-6 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            Sound Familiar?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-neumorphic rounded-[30px] p-8 relative quote-card card-hover">
              <p className="text-gray-300 leading-relaxed text-lg pt-4">
                You sent a great DM last week... but forgot to follow up
              </p>
            </div>
            <div className="card-neumorphic rounded-[30px] p-8 relative quote-card card-hover">
              <p className="text-gray-300 leading-relaxed text-lg pt-4">
                You&apos;re juggling LinkedIn, Twitter, Instagram DMs with no system
              </p>
            </div>
            <div className="card-neumorphic rounded-[30px] p-8 relative quote-card card-hover">
              <p className="text-gray-300 leading-relaxed text-lg pt-4">
                You know follow-ups close deals, but you can&apos;t keep track
              </p>
            </div>
          </div>
          <p className="text-center text-gray-400 mt-14 text-xl">
            You&apos;re not lazy. <span className="text-white">You just need a system.</span>
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-28 px-6 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-20">
            Your Follow-Up System in 30 Seconds
          </h2>
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector lines - visible on desktop */}
            <div className="hidden md:block absolute top-6 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-[2px]">
              <div className="w-full h-full border-t-2 border-dashed border-white/10" />
            </div>

            <div className="text-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-6 text-xl font-bold text-white shadow-lg shadow-blue-500/25">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Log Your DM</h3>
              <p className="text-gray-400 leading-relaxed">
                Add who you messaged, where, and when to follow up
              </p>
            </div>
            <div className="text-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-6 text-xl font-bold text-white shadow-lg shadow-purple-500/25">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Reminded</h3>
              <p className="text-gray-400 leading-relaxed">
                Receive a daily email at 8:30 AM with your follow-ups for the day
              </p>
            </div>
            <div className="text-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-6 text-xl font-bold text-white shadow-lg shadow-green-500/25">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Close More Deals</h3>
              <p className="text-gray-400 leading-relaxed">
                Never miss an opportunity. Stay on top of every conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-28 px-6 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            Everything You Need. Nothing You Don&apos;t.
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 card-hover">
              <div className="w-12 h-12 rounded-xl icon-blue flex items-center justify-center mb-5">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Daily Email Reminders</h3>
              <p className="text-gray-400 leading-relaxed">
                Wake up knowing exactly who to follow up with today
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 card-hover">
              <div className="w-12 h-12 rounded-xl icon-purple flex items-center justify-center mb-5">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Platform Tracking</h3>
              <p className="text-gray-400 leading-relaxed">
                LinkedIn, Twitter, Instagram, Email &ndash; all in one place
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 card-hover">
              <div className="w-12 h-12 rounded-xl icon-green flex items-center justify-center mb-5">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Dashboard</h3>
              <p className="text-gray-400 leading-relaxed">
                See today&apos;s follow-ups, overdue DMs, and your entire pipeline
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 card-hover">
              <div className="w-12 h-12 rounded-xl icon-orange flex items-center justify-center mb-5">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Simple & Fast</h3>
              <p className="text-gray-400 leading-relaxed">
                Add a DM in 10 seconds. No complex CRM setup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-28 px-6 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            Built For People Who Do Outreach
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl border border-transparent hover:border-white/10 transition-all duration-300">
              <div className="text-5xl mb-5">💼</div>
              <h3 className="text-xl font-semibold mb-3">Freelancers</h3>
              <p className="text-gray-400 leading-relaxed">
                Land more clients by following up consistently
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl border border-transparent hover:border-white/10 transition-all duration-300">
              <div className="text-5xl mb-5">📈</div>
              <h3 className="text-xl font-semibold mb-3">Salespeople</h3>
              <p className="text-gray-400 leading-relaxed">
                Never let a lead go cold again
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl border border-transparent hover:border-white/10 transition-all duration-300">
              <div className="text-5xl mb-5">🎨</div>
              <h3 className="text-xl font-semibold mb-3">Creators</h3>
              <p className="text-gray-400 leading-relaxed">
                Build relationships that grow your audience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-28 px-6 border-t border-white/5 scroll-mt-20 relative">
        <div className="hero-glow opacity-50" />
        <div className="mx-auto max-w-xl text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Get Early Access
          </h2>
          <p className="text-gray-400 mb-10">
            Join the waitlist and be the first to know when we launch new features.
          </p>
          <WaitlistForm />
          <p className="mt-6 text-sm text-gray-500">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            Cold DM Tracker &copy; 2025
          </div>
          <a
            href="https://twitter.com/SaaSbyMohd"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Twitter
          </a>
        </div>
      </footer>
    </div>
  );
}
