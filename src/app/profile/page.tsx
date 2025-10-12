"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, ArrowLeft, Save, Eye, EyeOff, Shield } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Get user profile data
  const { data: profile } = (api as any).user.getProfile.useQuery(
    undefined,
    {
      enabled: !!session?.user,
    }
  );

  // Update name state when profile data changes
  useEffect(() => {
    if (profile?.name) {
      setName(profile.name);
    }
  }, [profile?.name]);

  // Mutations
  const updateNameMutation = (api as any).user.updateName.useMutation({
    onSuccess: () => {
      toast.success("Name updated successfully!");
      setIsEditingName(false);
    },
    onError: (error: any) => {
      toast.error("Failed to update name", {
        description: error.message,
      });
    },
  });

  const updatePasswordMutation = (api as any).user.updatePassword.useMutation({
    onSuccess: () => {
      toast.success("Password updated successfully!");
      setIsEditingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
    },
    onError: (error: any) => {
      toast.error("Failed to update password", {
        description: error.message,
      });
    },
  });

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

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      updateNameMutation.mutate({ name: name.trim() });
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPassword && newPassword) {
      updatePasswordMutation.mutate({
        currentPassword,
        newPassword,
      });
    }
  };

  const handleCancelNameEdit = () => {
    setName(profile?.name || "");
    setIsEditingName(false);
  };

  const handleCancelPasswordEdit = () => {
    setCurrentPassword("");
    setNewPassword("");
    setIsEditingPassword(false);
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          {/* Profile Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-6">
              <Avatar className="h-20 w-20 shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-semibold">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {profile?.name || "User"}
                </h2>
                <p className="text-gray-600">{profile?.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">Account Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Settings */}
          <div className="p-6 space-y-8">
            {/* Name Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Display Name</span>
              </h3>
              
              {!isEditingName ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">{profile?.name || "No name set"}</p>
                    <p className="text-sm text-gray-500">This is how others will see your name</p>
                  </div>
                  <Button
                    onClick={() => setIsEditingName(true)}
                    variant="outline"
                    size="sm"
                    className="shadow-sm"
                  >
                    Edit
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleNameSubmit} className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="mb-3 shadow-sm"
                      autoFocus
                    />
                    <div className="flex space-x-3">
                      <Button
                        type="submit"
                        disabled={updateNameMutation.isPending || !name.trim()}
                        size="sm"
                        className="shadow-sm"
                      >
                        {updateNameMutation.isPending ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelNameEdit}
                        size="sm"
                        className="shadow-sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Password Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Password</span>
              </h3>
              
              {!isEditingPassword ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">••••••••</p>
                    <p className="text-sm text-gray-500">Keep your account secure with a strong password</p>
                  </div>
                  <Button
                    onClick={() => setIsEditingPassword(true)}
                    variant="outline"
                    size="sm"
                    className="shadow-sm"
                  >
                    Change Password
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="space-y-4">
                      {/* Current Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <Input
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            className="pr-10 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password (min 8 characters)"
                            className="pr-10 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex space-x-3 pt-2">
                        <Button
                          type="submit"
                          disabled={
                            updatePasswordMutation.isPending ||
                            !currentPassword ||
                            !newPassword ||
                            newPassword.length < 8
                          }
                          size="sm"
                          className="shadow-sm"
                        >
                          {updatePasswordMutation.isPending ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Update Password
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancelPasswordEdit}
                          size="sm"
                          className="shadow-sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Account Info */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-gray-900">{profile?.email}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700">User ID</p>
                  <p className="text-gray-900 font-mono text-xs">{profile?.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}