"use client";

import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import "../auth.css";
import { Github, Bot, Sparkles } from "lucide-react";

interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/chat";

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 shadow-xl">
              <Bot className="h-10 w-10 text-white" />
            </div>
            <h2 className="bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-800 bg-clip-text text-3xl font-bold text-transparent dark:from-white dark:via-purple-200 dark:to-blue-200">
              AI Career Counselor
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Your personalized career guidance companion
            </p>
          </div>

          {/* Sign In Card */}
          <div className="rounded-2xl border border-gray-200/50 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-800/80">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Welcome Back
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Sign in to continue your career journey
                </p>
              </div>

              {/* Providers */}
              <div className="space-y-4">
                {providers &&
                  Object.values(providers).map((provider) => (
                    <Button
                      key={provider.name}
                      onClick={() => signIn(provider.id, { callbackUrl })}
                      className="w-full bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600"
                      size="lg"
                    >
                      {provider.name === "GitHub" && (
                        <Github className="mr-2 h-5 w-5" />
                      )}
                      Continue with {provider.name}
                    </Button>
                  ))}
              </div>

              {/* Features */}
              <div className="mt-8 space-y-3 border-t border-gray-200 pt-6 dark:border-gray-700">
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <span>Personalized career guidance</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <span>AI-powered insights and recommendations</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                  <Sparkles className="h-4 w-4 text-pink-500" />
                  <span>Track your professional growth</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            By signing in, you agree to our terms of service and privacy policy.
          </div>
        </div>
      </div>
    </div>
  );
}