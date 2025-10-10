// src/app/chat/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, PlusCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export default function ChatMainPage() {
  const router = useRouter();
  
  // Get user's existing sessions
  const { data: sessions, isLoading } = api.session.getAllSessions.useQuery();
  
  // Mutation to create a new session
  const createSessionMutation = api.session.createSession.useMutation({
    onSuccess: (newSession) => {
      router.push(`/chat/${newSession.id}`);
    },
  });

  // Auto-redirect to the most recent session if available
  useEffect(() => {
    if (!isLoading && sessions && sessions.length > 0) {
      // Redirect to the most recent session (first in the array since they're ordered by createdAt desc)
      router.push(`/chat/${sessions[0]!.id}`);
    }
  }, [sessions, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your chats...</p>
        </div>
      </div>
    );
  }

  // Show welcome screen if no sessions exist
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <MessageSquare className="h-16 w-16 mx-auto mb-6 text-gray-400" />
        <h1 className="text-2xl font-bold mb-4">Welcome to AI Career Counselor</h1>
        <p className="text-gray-600 mb-8">
          Start your career counseling journey by creating your first chat session. 
          Get personalized advice and guidance for your professional development.
        </p>
        <Button
          onClick={() => createSessionMutation.mutate()}
          disabled={createSessionMutation.isPending}
          size="lg"
          className="w-full"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          {createSessionMutation.isPending ? "Creating..." : "Start New Chat"}
        </Button>
      </div>
    </div>
  );
}