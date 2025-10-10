// src/app/chat/layout.tsx
import { ChatSidebar } from "./_components/ChatSidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full">
      <div className="hidden w-80 flex-col border-r bg-gray-100/40 dark:bg-gray-800/40 md:flex">
        <ChatSidebar />
      </div>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}