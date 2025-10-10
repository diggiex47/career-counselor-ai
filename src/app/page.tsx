// src/app/page.tsx
import Link from "next/link";
import { auth } from "~/server/auth"; // Your auth import is correct

export default async function HomePage() {
  // We call auth() to get the current user's session on the server.
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          AI Career Counselor
        </h1>

        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-2xl text-white">
            {/* Display the user's name if they are logged in */}
            {session && <span>Logged in as {session.user?.name}</span>}
          </p>

          {/* This button will show "Sign out" if there is a session, or "Sign in" if there isn't. */}
          <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
          >
            {session ? "Sign out" : "Sign in"}
          </Link>

          {/* This "Go to Chat" button will ONLY be rendered if the user is logged in. */}
          {session && (
             <Link
             href="/chat"
             className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
           >
             Go to Chat
           </Link>
          )}
        </div>
      </div>
    </main>
  );
}