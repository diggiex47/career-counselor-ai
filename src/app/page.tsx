// src/app/page.tsx
import Link from "next/link";
import { auth } from "~/server/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center text-white transition-all duration-1000 ${
      session 
        ? "bg-gradient-to-br from-rose-500 via-pink-500 to-red-400" // Enhanced gradient with more colors when signed in
        : "bg-gradient-to-b from-[#2e026d] to-[#15162c]" // Original purple when not signed in
    }`}>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          AI Career
          <span className={session ? "text-amber-200" : "text-[hsl(280,100%,70%)]"}> Counselor</span>
        </h1>

        <div className="flex flex-col items-center gap-6">
          <p className="text-center text-xl text-white/80 max-w-2xl leading-relaxed">
            {session && (
              <span className="block mb-4 text-lg">
                👋 Welcome back, <span className="font-semibold text-slate-800">{session.user?.name}</span>!
              </span>
            )}
            I'm here to help you navigate your career journey. Whether you're exploring new opportunities, 
            facing workplace challenges, or planning your next move, let's have a conversation about your professional goals.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            {session ? (
              <>
                <Link
                  href="/chat"
                  className="group rounded-full bg-white/10 px-10 py-4 font-semibold text-white no-underline transition-all hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center gap-2">
                    💬 Continue Our Conversation
                  </span>
                </Link>
                
                <Link
                  href="/api/auth/signout"
                  className="rounded-full border-2 border-white/30 px-8 py-3 font-semibold text-white/80 no-underline transition hover:border-white/50 hover:text-white shadow-md hover:shadow-lg"
                >
                  Sign out
                </Link>
              </>
            ) : (
              <Link
                href="/api/auth/signin"
                className="group rounded-full bg-white/10 px-10 py-4 font-semibold text-white no-underline transition-all hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center gap-2">
                  ✨ Start Your Career Journey
                </span>
              </Link>
            )}
          </div>

          {!session && (
            <div className="mt-8 text-center">
              <p className="text-white/60 text-sm mb-4">
                Join me for a personal, one-on-one conversation about your career
              </p>
              <div className="flex items-center justify-center gap-6 text-white/40 text-xs">
                <span className="flex items-center gap-1">
                  🔒 Private & Secure
                </span>
                <span className="flex items-center gap-1">
                  🎯 Personalized Advice
                </span>
                <span className="flex items-center gap-1">
                  💡 Always Available
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}