// src/app/chat/layout.tsx
"use client";

import { useState, lazy, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Performance optimization: Lazy load ChatSidebar
const ChatSidebar = lazy(() => import("./_components/ChatSidebar").then(module => ({ default: module.ChatSidebar })));

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Client-side protection as backup to middleware
  useEffect(() => {
    if (status === "loading") return; // Still loading
    
    if (status === "unauthenticated") {
      console.log("🚨 Client-side: User not authenticated, redirecting to sign-in");
      router.push("/api/auth/signin");
      return;
    }
    
    console.log("✅ Client-side: User authenticated, allowing access");
  }, [status, router]);

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting unauthenticated users
  if (status === "unauthenticated") {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirecting to sign-in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          {/* Sidebar header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Chat Sessions
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-hidden">
            <Suspense fallback={
              <div className="flex items-center justify-center p-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-500 border-t-transparent"></div>
              </div>
            }>
              <ChatSidebar />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4 md:hidden dark:border-gray-700 dark:bg-gray-800">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-30r:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-lg font-semibold text-transparent">
            AI Career Counselor
          </h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Chat content */}
        <div className="relative flex flex-1 flex-col overflow-hidden bg-white/50 backdrop-blur-sm dark:bg-slate-800/50">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.3) 1px, transparent 0)`,
                backgroundSize: "20px 20px",
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-1 flex-col">{children}</div>
        </div>
      </main>
    </div>
  );
}
