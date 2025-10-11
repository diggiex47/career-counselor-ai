// src/app/chat/[sessionId]/page.tsx
"use client";

import type { AppRouter } from "~/server/api/root";
import type { TRPCClientErrorLike } from "@trpc/client";
import { Send, User, LogOut, Settings } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

import Link from "next/link";

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-start gap-4">
      <Avatar>
        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          AI
        </AvatarFallback>
      </Avatar>
      <div className="max-w-[75%] rounded-2xl bg-gray-100 px-4 py-3 dark:bg-gray-700">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="typing-dot h-2 w-2 rounded-full bg-gray-500"></div>
            <div className="typing-dot h-2 w-2 rounded-full bg-gray-500"></div>
            <div className="typing-dot h-2 w-2 rounded-full bg-gray-500"></div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            AI is typing...
          </span>
        </div>
      </div>
    </div>
  );
}

// User profile dropdown component
function UserProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-blue-600 text-sm text-white">
            U
          </AvatarFallback>
        </Avatar>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute top-full right-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-gray-200 px-4 py-2 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                User
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Authenticated User
              </p>
            </div>

            <Link
              href="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>

            <Link
              href="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>

            <Link
              href="/api/auth/signout"
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

// Format timestamp
function formatTimestamp(date: Date) {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInMinutes = Math.floor(
    (now.getTime() - messageDate.getTime()) / (1000 * 60),
  );

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;

  return messageDate.toLocaleDateString();
}

export default function ChatPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const utils = api.useUtils();

  // Query to fetch messages
  const { data: messages, isLoading: messagesLoading } =
    api.chat.getMessages.useQuery(
      { chatSessionId: sessionId },
      { enabled: !!sessionId },
    );

  const handleMutationSuccess = () => {
    utils.chat.getMessages.invalidate({ chatSessionId: sessionId });
  };

  const handleMutationError = (error: TRPCClientErrorLike<AppRouter>) => {
    toast.error("Error sending message", {
      description: error.message,
    });
  };

  const sendMessageMutation = api.chat.sendMessage.useMutation({
    onSuccess: handleMutationSuccess,
    onError: handleMutationError,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessageMutation.mutate({ chatSessionId: sessionId, content: input });
    setInput("");
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendMessageMutation.isPending]);

  return (
    <div className="flex h-screen flex-col">
      {/* FIXED Header - Always stays at top */}
      <header className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white/95 p-4 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/95">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Career Counselor
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            AI-powered career guidance
          </p>
        </div>
        <UserProfileDropdown />
      </header>

      {/* SCROLLABLE Messages area - Takes remaining space */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ height: "calc(100vh - 140px)" }} // Explicit height calculation
      >
        <div className="space-y-6 p-4">
          {messagesLoading && (
            <div className="space-y-4">
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="ml-auto h-16 w-3/4" />
              <Skeleton className="h-16 w-3/4" />
            </div>
          )}

          {messages?.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-4 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                {message.role === "assistant" ? (
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-sm text-white">
                    AI
                  </AvatarFallback>
                ) : (
                  <AvatarFallback className="bg-blue-600 text-sm text-white">
                    U
                  </AvatarFallback>
                )}
              </Avatar>

              <div
                className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} max-w-[75%]`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>

                {/* Timestamp */}
                <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {formatTimestamp(message.createdAt)}
                </span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {sendMessageMutation.isPending && <TypingIndicator />}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* FIXED Input area - Always stays at bottom */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/95">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your career path..."
              autoComplete="off"
              disabled={sendMessageMutation.isPending}
              className="border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
            />
          </div>
          <Button
            type="submit"
            disabled={sendMessageMutation.isPending || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
