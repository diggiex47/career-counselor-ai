"use client";

import { MessageSquare, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

export function ChatSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(
    null,
  );
  const utils = api.useUtils();

  const {
    data: sessions,
    isLoading,
    isError,
  } = api.session.getAllSessions.useQuery();

  const createSessionMutation = api.session.createSession.useMutation({
    onSuccess: (newSession) => {
      router.push(`/chat/${newSession.id}`);
    },
  });

  const deleteSessionMutation = api.session.deleteSession.useMutation({
    onSuccess: (data) => {
      // Invalidate sessions to refresh the list
      utils.session.getAllSessions.invalidate();

      // If we're currently viewing the deleted session, redirect to main chat page
      if (pathname === `/chat/${data.deletedSessionId}`) {
        router.push("/chat");
      }

      toast.success("Chat session deleted successfully");
      setDeletingSessionId(null);
    },
    onError: (error) => {
      toast.error("Failed to delete chat session", {
        description: error.message,
      });
      setDeletingSessionId(null);
    },
  });

  const handleDeleteSession = (
    sessionId: string,
    sessionTopic: string,
    e: React.MouseEvent,
  ) => {
    e.preventDefault(); // Prevent navigation when clicking delete
    e.stopPropagation(); // Stop event bubbling

    // Confirm deletion
    if (
      window.confirm(
        `Are you sure you want to delete "${sessionTopic}"? This action cannot be undone.`,
      )
    ) {
      setDeletingSessionId(sessionId);
      deleteSessionMutation.mutate({ sessionId });
    }
  };

  return (
    <div className="flex h-full flex-col p-4">
      <Button
        onClick={() => createSessionMutation.mutate()}
        disabled={createSessionMutation.isPending}
        className="mb-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        New Chat
      </Button>

      <div className="flex-1 overflow-auto">
        <nav className="grid items-start gap-1 text-sm font-medium">
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}
          {isError && <p className="text-red-500">Failed to load chats.</p>}
          {sessions?.map((session) => (
            <div
              key={session.id}
              className={`group relative flex items-center rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-800 ${
                pathname === `/chat/${session.id}`
                  ? "bg-gray-200 dark:bg-gray-700"
                  : ""
              }`}
            >
              <Link
                href={`/chat/${session.id}`}
                className="flex flex-1 items-center gap-3 px-3 py-3 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{session.topic}</span>
              </Link>

              {/* Delete button - appears on hover */}
              <button
                onClick={(e) =>
                  handleDeleteSession(session.id, session.topic, e)
                }
                disabled={deletingSessionId === session.id}
                className="absolute right-2 rounded p-1 text-gray-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                title={`Delete "${session.topic}"`}
              >
                {deletingSessionId === session.id ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-500"></div>
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
