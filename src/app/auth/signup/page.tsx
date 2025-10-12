"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import {
  Github,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
} from "lucide-react";
import "../auth.css";

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const { confirmPassword: _, ...submitData } = formData; // Remove confirmPassword from submission
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully! Please sign in.");
        router.push("/auth/signin");
      } else {
        toast.error(data.error || "Failed to create account");
      }
    } catch {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-800 bg-clip-text text-3xl font-bold text-transparent">
              AI Career Counselor
            </h2>
            <p className="mt-2 text-gray-600">
              Start your personalized career journey today
            </p>
          </div>

          {/* Sign Up Card */}
          <div className="rounded-2xl border border-gray-200/50 bg-white/80 p-8 shadow-xl backdrop-blur-md">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Create Your Account
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Join thousands of professionals advancing their careers
                </p>
              </div>

              {/* OAuth Sign Up */}
              <div className="space-y-4">
                <Button
                  onClick={() => signIn("github", { callbackUrl: "/chat" })}
                  className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg hover:from-gray-500 hover:to-gray-600"
                  size="lg"
                >
                  <Github className="mr-2 h-5 w-5" />
                  Continue with GitHub
                </Button>

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

              {/* Email/Password Sign Up Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 shadow-sm !text-gray-900 !bg-white border-gray-300"
                      placeholder="Enter your full name"
                      style={{ color: '#111827 !important', backgroundColor: '#ffffff !important' }}
                    />
                  </div>
                </div>

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
                      className="pl-10 shadow-sm !text-gray-900 !bg-white border-gray-300"
                      placeholder="Enter your email"
                      style={{ color: '#111827 !important', backgroundColor: '#ffffff !important' }}
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
                      className="pr-10 pl-10 shadow-sm !text-gray-900 !bg-white border-gray-300"
                      placeholder="Create a strong password"
                      minLength={8}
                      style={{ color: '#111827 !important', backgroundColor: '#ffffff !important' }}
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
                  <p className="mt-1 text-xs text-gray-500">
                    Must be at least 8 characters long
                  </p>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`pr-10 pl-10 shadow-sm !text-gray-900 !bg-white ${
                        formData.confirmPassword &&
                        formData.password !== formData.confirmPassword
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : formData.confirmPassword &&
                              formData.password === formData.confirmPassword
                            ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                            : "border-gray-300"
                      }`}
                      style={{ color: '#111827 !important', backgroundColor: '#ffffff !important' }}
                      placeholder="Confirm your password"
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {formData.confirmPassword && (
                    <p
                      className={`mt-1 text-xs ${
                        formData.password === formData.confirmPassword
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formData.password === formData.confirmPassword
                        ? "✓ Passwords match"
                        : "✗ Passwords do not match"}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={
                    isLoading ||
                    !formData.name ||
                    !formData.email ||
                    !formData.password ||
                    !formData.confirmPassword ||
                    formData.password !== formData.confirmPassword ||
                    formData.password.length < 8
                  }
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg hover:from-purple-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/auth/signin"
                    className="font-medium text-purple-600 hover:text-purple-500"
                  >
                    Sign in here
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
