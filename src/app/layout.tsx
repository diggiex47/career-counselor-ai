import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "sonner";
import { ThemeProvider } from "~/components/theme-provider";
import { ErrorBoundary } from "~/components/error-boundary";
import { PerformanceMonitor } from "~/components/performance-monitor";

export const metadata: Metadata = {
  title: "AI Career Counselor - Your Personal Career Guide",
  description: "Get personalized career guidance with AI-powered insights. Explore opportunities, plan your professional journey, and achieve your career goals.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="system">
          <ErrorBoundary>
            <SessionProvider>
              <TRPCReactProvider>
                {children}
                <Toaster />
                <PerformanceMonitor />
              </TRPCReactProvider>
            </SessionProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
