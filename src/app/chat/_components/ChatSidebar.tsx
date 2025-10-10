"use client";

import { MessageSquare, PlusCircle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

export function ChatSidebar() {
  const router = useRouter();
  const pathname = usePathname();

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

  return (
    <div className="flex h-full flex-col p-4">
      <Button
        onClick={() => createSessionMutation.mutate()}
        disabled={createSessionMutation.isPending}
        className="mb-4 w-full"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        New Chat
      </Button>

      <div className="flex-1 overflow-auto">
        <nav className="grid items-start gap-1 text-sm font-medium">
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          )}
          {isError && <p className="text-red-500">Failed to load chats.</p>}
          {sessions?.map((session) => (
            <Link
              key={session.id}
              href={`/chat/${session.id}`}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
                pathname === `/chat/${session.id}`
                  ? "bg-gray-200 dark:bg-gray-700"
                  : ""
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              {session.topic}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
