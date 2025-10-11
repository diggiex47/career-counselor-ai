// src/app/chat/layout.tsx
"use client";

import { useState } from "react";
import { ChatSidebar } from "./_components/ChatSidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} `}
      >
        <div className="flex h-full flex-col border-r border-white/20 bg-white/80 shadow-xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/80">
          {/* Sidebar header */}
          <div className="flex items-center justify-between border-b border-white/10 p-4 dark:border-slate-700/50">
            <h2 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-lg font-semibold text-transparent">
              Chat Sessions
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-gray-500 transition-colors duration-200 hover:bg-gray-100 md:hidden dark:text-gray-400 dark:hover:bg-slate-800"
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
            <ChatSidebar />
          </div>
        </div>
      </div>

      {/* Main content area */}
      <main className="relative flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <div className="flex items-center justify-between border-b border-white/20 bg-white/80 p-4 shadow-sm backdrop-blur-xl md:hidden dark:border-slate-700/50 dark:bg-slate-900/80">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
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
