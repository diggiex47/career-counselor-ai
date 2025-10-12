"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Shield, Bell, Palette, Globe } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
    return null;
  }

  const settingsOptions = [
    {
      icon: User,
      title: "Profile",
      description: "Manage your personal information and account details",
      href: "/profile",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Control your privacy settings and security preferences",
      href: "#",
      color: "text-green-600",
      bgColor: "bg-green-50",
      comingSoon: true,
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Customize your notification preferences",
      href: "#",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      comingSoon: true,
    },
    {
      icon: Palette,
      title: "Appearance",
      description: "Customize the look and feel of your interface",
      href: "#",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      comingSoon: true,
    },
    {
      icon: Globe,
      title: "Language & Region",
      description: "Set your language and regional preferences",
      href: "#",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      comingSoon: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Account Settings
            </h2>
            
            <div className="grid gap-4">
              {settingsOptions.map((option, index) => {
                const IconComponent = option.icon;
                
                if (option.comingSoon) {
                  return (
                    <div
                      key={index}
                      className="flex items-center p-4 rounded-lg border border-gray-200 bg-gray-50 opacity-60"
                    >
                      <div className={`p-3 rounded-lg ${option.bgColor} mr-4`}>
                        <IconComponent className={`h-6 w-6 ${option.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                          <span>{option.title}</span>
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                            Coming Soon
                          </span>
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={index}
                    href={option.href}
                    className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-white"
                  >
                    <div className={`p-3 rounded-lg ${option.bgColor} mr-4`}>
                      <IconComponent className={`h-6 w-6 ${option.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {option.description}
                      </p>
                    </div>
                    <div className="text-gray-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Account Information
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Email</span>
                <span className="font-medium text-gray-900">{session?.user?.email}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Name</span>
                <span className="font-medium text-gray-900">{session?.user?.name || "Not set"}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Account Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}