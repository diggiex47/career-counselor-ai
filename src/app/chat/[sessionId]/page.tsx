// src/app/chat/[sessionId]/page.tsx
"use client";

// Add these lines at the top with your other imports
import type { AppRouter } from "~/server/api/root";
import type { TRPCClientErrorLike } from "@trpc/client";
// import { TRPCClientError } from "@trpc/client";

import { Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
// import { error } from "console";

export default function ChatPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
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

  // Fix: Use useMutation directly, not as a function
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

  useEffect(() => {
    const scrollViewport = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    if (scrollViewport) {
      scrollViewport.scrollTo({
        top: scrollViewport.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      <header className="border-b p-4">
        <h2 className="text-xl font-bold">Career Counselor</h2>
      </header>

      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="space-y-4 p-4">
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
                message.role === "user" ? "justify-end" : ""
              }`}
            >
              {message.role === "assistant" && (
                <Avatar>
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[75%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-50"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === "user" && (
                <Avatar>
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your career path..."
            autoComplete="off"
            disabled={sendMessageMutation.isPending}
          />
          <Button type="submit" disabled={sendMessageMutation.isPending}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
