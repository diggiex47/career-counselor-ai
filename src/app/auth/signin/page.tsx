"use client";

import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import "../auth.css";
import { Github, Mail, Lock, Eye, EyeOff } from "lucide-react";

interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

function SignInForm() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/chat";

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    void fetchProviders();
  }, []);

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting signin with:", { email: formData.email, callbackUrl });
      
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        callbackUrl,
        redirect: false,
      });

      console.log("Signin result:", result);

      if (result?.error) {
        console.error("Signin error:", result.error);
        toast.error("Invalid email or password");
      } else if (result?.ok) {
        console.log("Signin successful, redirecting to:", callbackUrl);
        // Force a hard redirect to ensure proper session setup
        window.location.href = callbackUrl;
      } else {
        toast.error("Sign in failed. Please try again.");
      }
    } catch (error) {
      console.error("Signin exception:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              AI Career Counselor
            </h2>
            <p className="mt-2 text-gray-600">
              Your personalized career guidance companion
            </p>
          </div>

          {/* Sign In Card */}
          <div className="rounded-2xl border border-gray-200/50 bg-white/80 p-8 shadow-xl backdrop-blur-md">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Welcome Back
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Sign in to continue your career journey
                </p>
              </div>

              {/* OAuth Providers */}
              <div className="space-y-4">
                {providers &&
                  Object.values(providers)
                    .filter((provider) => provider.id !== "credentials")
                    .map((provider) => (
                      <Button
                        key={provider.name}
                        onClick={() => signIn(provider.id, { callbackUrl })}
                        className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg hover:from-gray-500 hover:to-gray-600"
                        size="lg"
                      >
                        {provider.name === "GitHub" && (
                          <Github className="mr-2 h-5 w-5" />
                        )}
                        Continue with {provider.name}
                      </Button>
                    ))}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">
                      Or continue with email
                    </span>
                  </div>
                </div>
              </div>

              {/* Email/Password Sign In Form */}
              <form onSubmit={handleCredentialsSignIn} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border-gray-300 !bg-white pl-10 !text-gray-900 shadow-sm"
                      placeholder="Enter your email"
                      style={{
                        color: "#111827 !important",
                        backgroundColor: "#ffffff !important",
                      }}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="border-gray-300 !bg-white pr-10 pl-10 !text-gray-900 shadow-sm"
                      placeholder="Enter your password"
                      style={{
                        color: "#111827 !important",
                        backgroundColor: "#ffffff !important",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg hover:from-blue-500 hover:to-blue-600"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/signup"
                    className="font-medium text-purple-600 hover:text-purple-500"
                  >
                    Create one here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-white">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
