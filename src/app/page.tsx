// src/app/page.tsx
import Link from "next/link";
import { auth } from "~/server/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-gray-900 transition-all duration-1000">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-[5rem]">
          AI Career
          <span className="text-purple-600"> Counselor</span>
        </h1>

        <div className="flex flex-col items-center gap-6">
          <p className="max-w-2xl text-center text-xl leading-relaxed text-gray-600">
            {session && (
              <span className="mb-4 block text-lg">
                👋 Welcome back,{" "}
                <span className="font-semibold text-gray-900">
                  {session.user?.name}
                </span>
                !
              </span>
            )}
            I'm here to help you navigate your career journey. Whether you're
            exploring new opportunities, facing workplace challenges, or
            planning your next move, let's have a conversation about your
            professional goals.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            {session ? (
              <>
                <Link
                  href="/chat"
                  className="group rounded-full bg-purple-600 px-10 py-4 font-semibold text-white no-underline shadow-lg transition-all hover:scale-105 hover:bg-purple-700 hover:shadow-xl focus:ring-4 focus:ring-purple-300 focus:outline-none"
                >
                  <span className="flex items-center gap-2">
                    💬 Continue Our Conversation
                  </span>
                </Link>

                <Link
                  href="/api/auth/signout"
                  className="rounded-full border-2 border-gray-300 px-8 py-3 font-semibold text-gray-700 no-underline shadow-md transition hover:border-gray-400 hover:text-gray-900 hover:shadow-lg"
                >
                  Sign out
                </Link>
              </>
            ) : (
              <Link
                href="/api/auth/signin"
                className="group rounded-full bg-purple-600 px-10 py-4 font-semibold text-white no-underline shadow-lg transition-all hover:scale-105 hover:bg-purple-700 hover:shadow-xl focus:ring-4 focus:ring-purple-300 focus:outline-none"
              >
                <span className="flex items-center gap-2">
                  ✨ Start Your Career Journey
                </span>
              </Link>
            )}
          </div>

          {!session && (
            <div className="mt-8 text-center">
              <p className="mb-4 text-sm text-gray-500">
                Join me for a personal, one-on-one conversation about your
                career
              </p>
              <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
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
