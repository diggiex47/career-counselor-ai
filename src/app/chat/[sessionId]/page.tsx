// src/app/chat/[sessionId]/page.tsx
"use client";

import type { AppRouter } from "~/server/api/root";
import type { TRPCClientErrorLike } from "@trpc/client";
import { Send, User, LogOut, Settings, Bot, Sparkles } from "lucide-react";
import "../chat.css";
import { useParams } from "next/navigation";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

import Link from "next/link";

// Enhanced typing indicator with smooth animations - Memoized for performance
const TypingIndicator = React.memo(() => {
  return (
    <div className="animate-in slide-in-from-left-5 flex items-start gap-4 duration-500">
      <Avatar className="shadow-md transition-all duration-300 hover:shadow-lg">
        <AvatarFallback className="bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 text-white shadow-inner">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="max-w-[75%] rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 shadow-lg dark:border-gray-600 dark:from-gray-700 dark:to-gray-800 dark:shadow-gray-900/20">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <div className="typing-dot h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.3s]"></div>
            <div className="typing-dot h-2 w-2 animate-bounce rounded-full bg-pink-500 [animation-delay:-0.15s]"></div>
            <div className="typing-dot h-2 w-2 animate-bounce rounded-full bg-indigo-500"></div>
          </div>
          <div className="flex items-center space-x-1">
            <Sparkles className="h-3 w-3 animate-pulse text-purple-500" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              AI is thinking...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

TypingIndicator.displayName = "TypingIndicator";

// Enhanced user profile dropdown with smooth animations - Memoized for performance
const UserProfileDropdown = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center space-x-2 rounded-full p-1 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-gray-100 hover:shadow-md dark:hover:bg-gray-800"
      >
        <Avatar className="h-8 w-8 shadow-md transition-all duration-200 group-hover:shadow-lg">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white shadow-inner">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </button>

      {isOpen && (
        <>
          {/* Backdrop without blur */}
          <div
            className="fixed inset-0 z-[100] bg-black/5"
            onClick={() => setIsOpen(false)}
          />

          {/* Solid dropdown menu with animations */}
          <div className="animate-in slide-in-from-top-2 absolute top-full right-0 z-[110] mt-2 w-56 rounded-xl border border-gray-200 bg-white py-2 shadow-2xl duration-200 dark:border-gray-700 dark:bg-gray-800 dark:shadow-black/40">
            <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 shadow-md">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 font-semibold text-white shadow-inner">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Career Explorer
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Professional Growth Journey
                  </p>
                </div>
              </div>
            </div>

            <div className="py-1">
              <Link
                href="/profile"
                className="flex items-center px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                onClick={() => setIsOpen(false)}
              >
                <User className="mr-3 h-4 w-4" />
                <span className="font-medium">Profile</span>
              </Link>

              <Link
                href="/settings"
                className="flex items-center px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="mr-3 h-4 w-4" />
                <span className="font-medium">Settings</span>
              </Link>

              <div className="mt-1 border-t border-gray-200 pt-1 dark:border-gray-700">
                <Link
                  href="/api/auth/signout"
                  className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                  onClick={() => setIsOpen(false)}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="font-medium">Sign out</span>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

UserProfileDropdown.displayName = "UserProfileDropdown";

// Format timestamp - Memoized for performance
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

  // Performance optimization: Memoize handlers to prevent unnecessary re-renders
  const handleMutationSuccess = useCallback(() => {
    utils.chat.getMessages.invalidate({ chatSessionId: sessionId });
    // Also invalidate sessions to refresh sidebar (in case session name was updated)
    utils.session.getAllSessions.invalidate();
  }, [utils.chat.getMessages, utils.session.getAllSessions, sessionId]);

  const handleMutationError = useCallback(
    (error: TRPCClientErrorLike<AppRouter>) => {
      toast.error("Error sending message", {
        description: error.message,
      });
    },
    [],
  );

  const sendMessageMutation = api.chat.sendMessage.useMutation({
    onSuccess: handleMutationSuccess,
    onError: handleMutationError,
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      sendMessageMutation.mutate({ chatSessionId: sessionId, content: input });
      setInput("");
    },
    [input, sendMessageMutation, sessionId],
  );

  // Performance optimization: Memoize formatted messages to prevent unnecessary re-renders
  const formattedMessages = useMemo(() => {
    return (
      messages?.map((message, index) => ({
        ...message,
        animationDelay: `${index * 100}ms`,
        formattedTime: formatTimestamp(message.createdAt),
      })) || []
    );
  }, [messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendMessageMutation.isPending]);

  return (
    <div className="flex h-screen flex-col">
      {/* ENHANCED Header with gradient and animations */}
      <header className="relative z-30 flex flex-shrink-0 items-center justify-between border-b border-gray-200/50 bg-white p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              AI Career Counselor
            </h2>
            <div className="flex items-center space-x-2">
              <div className="relative z-10 h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
              <p className="text-sm font-medium text-gray-600">
                Ready to help with your career journey
              </p>
            </div>
          </div>
        </div>
        <UserProfileDropdown />
      </header>

      {/* SCROLLABLE Messages area - Takes remaining space */}
      <div
        className="relative z-10 flex-1 overflow-y-auto shadow-inner"
        style={{ height: "calc(100vh - 140px)" }} // Explicit height calculation
      >
        <div className="space-y-6 p-4">
          {messagesLoading && (
            <div className="space-y-4">
              <Skeleton className="h-16 w-3/4 shadow-md" />
              <Skeleton className="ml-auto h-16 w-3/4 shadow-md" />
              <Skeleton className="h-16 w-3/4 shadow-md" />
            </div>
          )}

          {formattedMessages.map((message) => (
            <div
              key={message.id}
              className={`animate-in slide-in-from-bottom-3 relative z-10 flex items-start gap-4 duration-500 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
              style={{ animationDelay: message.animationDelay }}
            >
              <Avatar className="relative z-10 h-8 w-8 flex-shrink-0 shadow-md transition-all duration-300 hover:shadow-lg">
                {message.role === "assistant" ? (
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 text-sm text-white shadow-inner">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-sm text-white shadow-inner">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                )}
              </Avatar>

              <div
                className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} group max-w-[75%]`}
              >
                <div
                  className={`rounded-2xl border px-4 py-3 transition-all duration-300 ${
                    message.role === "user"
                      ? "border-purple-200 bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg"
                      : "border-gray-200 bg-white text-gray-900 shadow-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">
                    {message.content}
                  </p>

                  {/* Message Status Indicator for user messages */}
                  {message.role === "user" && (
                    <div className="mt-2 flex items-center justify-end">
                      <div className="flex items-center space-x-1 text-xs text-white/80">
                        <div className="h-1 w-1 animate-pulse rounded-full bg-green-400"></div>
                        <span className="font-medium">Delivered</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced timestamp with fade-in on hover */}
                <span className="mt-2 text-xs font-medium text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-gray-400">
                  {message.formattedTime}
                </span>
              </div>
            </div>
          ))}

          {/* Sending message indicator */}
          {sendMessageMutation.isPending && (
            <div className="animate-in slide-in-from-bottom-3 relative z-10 flex flex-row-reverse items-start gap-4 duration-300">
              <Avatar className="relative z-10 h-8 w-8 flex-shrink-0 shadow-md">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-sm text-white shadow-inner">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>

              <div className="flex max-w-[75%] flex-col items-end">
                <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-400 to-indigo-500 px-4 py-3 text-white opacity-70 shadow-lg">
                  <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">
                    {input}
                  </p>
                  <div className="mt-2 flex items-center justify-end">
                    <div className="flex items-center space-x-1 text-xs text-white/80">
                      <div className="h-1 w-1 animate-pulse rounded-full bg-yellow-400"></div>
                      <span className="font-medium">Sending...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Typing indicator */}
          {sendMessageMutation.isPending && <TypingIndicator />}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ENHANCED Input area with gradient and animations */}
      <div className="flex-shrink-0 border-t border-gray-200/50 bg-white p-4 shadow-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] backdrop-blur-md">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your career path, goals, or challenges..."
              autoComplete="off"
              disabled={sendMessageMutation.isPending}
              className="rounded-xl border-gray-300 bg-white py-4 pr-12 pl-4 text-base font-medium text-gray-900 shadow-md transition-all duration-300 placeholder:text-gray-400 hover:shadow-lg focus:border-purple-500 focus:text-gray-900 focus:shadow-lg focus:ring-4 focus:ring-purple-500/20"
              style={{ color: "#111827" }}
            />
            {input.trim() && (
              <div className="absolute top-1/2 right-3 -translate-y-1/2 drop-shadow-sm">
                <Sparkles className="h-4 w-4 animate-pulse text-blue-500" />
              </div>
            )}
          </div>
          <Button
            type="submit"
            disabled={sendMessageMutation.isPending || !input.trim()}
            className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-indigo-700 hover:shadow-2xl focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {sendMessageMutation.isPending ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
