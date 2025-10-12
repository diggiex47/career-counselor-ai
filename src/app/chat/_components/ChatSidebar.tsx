"use client";

import { MessageSquare, PlusCircle, Trash2, Edit3 } from "lucide-react";
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
  const [editingSessionId, setEditingSessionId] = useState<string | null>(
    null,
  );
  const [editingName, setEditingName] = useState("");
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

  const updateSessionMutation = api.session.updateSessionName.useMutation({
    onSuccess: () => {
      utils.session.getAllSessions.invalidate();
      toast.success("Session name updated successfully");
      setEditingSessionId(null);
      setEditingName("");
    },
    onError: (error) => {
      toast.error("Failed to update session name", {
        description: error.message,
      });
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

  const handleEditSession = (
    sessionId: string,
    currentName: string,
    e: React.MouseEvent,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingSessionId(sessionId);
    setEditingName(currentName);
  };

  const handleSaveEdit = (sessionId: string) => {
    if (editingName.trim() && editingName !== "") {
      updateSessionMutation.mutate({
        sessionId,
        topic: editingName.trim(),
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingSessionId(null);
    setEditingName("");
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
              {editingSessionId === session.id ? (
                // Edit mode
                <div className="flex flex-1 items-center gap-2 px-3 py-3">
                  <MessageSquare className="h-4 w-4 flex-shrink-0 text-gray-500" />
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSaveEdit(session.id);
                      } else if (e.key === "Escape") {
                        handleCancelEdit();
                      }
                    }}
                    className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEdit(session.id)}
                    className="rounded p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                    title="Save"
                  >
                    ✓
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="rounded p-1 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                    title="Cancel"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                // Normal mode
                <>
                  <Link
                    href={`/chat/${session.id}`}
                    className="flex flex-1 items-center gap-3 px-3 py-3 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                    <MessageSquare className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{session.topic}</span>
                  </Link>

                  {/* Action buttons - appear on hover */}
                  <div className="absolute right-2 flex items-center space-x-1 opacity-0 transition-all duration-200 group-hover:opacity-100">
                    {/* Edit button */}
                    <button
                      onClick={(e) =>
                        handleEditSession(session.id, session.topic, e)
                      }
                      className="rounded-md bg-white/90 p-1.5 text-gray-600 shadow-sm backdrop-blur-sm transition-all hover:bg-blue-50 hover:text-blue-600 hover:shadow-md dark:bg-gray-800/90 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                      title={`Edit "${session.topic}"`}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={(e) =>
                        handleDeleteSession(session.id, session.topic, e)
                      }
                      disabled={deletingSessionId === session.id}
                      className="rounded-md bg-white/90 p-1.5 text-gray-600 shadow-sm backdrop-blur-sm transition-all hover:bg-red-50 hover:text-red-600 hover:shadow-md dark:bg-gray-800/90 dark:text-gray-300 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                      title={`Delete "${session.topic}"`}
                    >
                      {deletingSessionId === session.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-500"></div>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
