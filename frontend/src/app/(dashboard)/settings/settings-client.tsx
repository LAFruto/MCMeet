"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient, useSession } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

/**
 * Settings Client Component
 *
 * Client component for managing user settings including account details,
 * password changes, and notification preferences.
 *
 * @returns {JSX.Element} The settings client component
 */
export default function SettingsClient() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [isUsernameDialogOpen, setIsUsernameDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const user = session?.user;
  const userAvatar =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmitPasswordChange(values: ChangePasswordFormValues) {
    setIsLoading(true);

    try {
      const result = await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (result.error) {
        toast.error(result.error.message || "Failed to change password");
        setIsLoading(false);
        return;
      }

      toast.success("Password changed successfully!");
      reset();
      setIsPasswordDialogOpen(false);
    } catch (error: any) {
      console.error("Password change error:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-1">Settings</h1>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-6 h-auto p-0 bg-transparent gap-4">
            <TabsTrigger
              value="account"
              className="data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 pb-2"
            >
              Account
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 pb-2"
            >
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-8 mt-6">
            {/* Profile Section */}
            <div className="flex items-center gap-4 pb-8 border-b">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                {userAvatar}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">
                  {user?.name || "User"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {user?.email || "No email"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                disabled
              >
                Change avatar
              </Button>
            </div>

            {/* Full Name */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Full Name</Label>
              <div className="flex items-center gap-3">
                <Input
                  value={user?.name || ""}
                  disabled
                  className="flex-1 h-10"
                />
                <Dialog
                  open={isNameDialogOpen}
                  onOpenChange={setIsNameDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                    >
                      Change full name
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader className="pb-2">
                      <DialogTitle className="text-lg">
                        Change full name
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm">
                          Full Name
                        </Label>
                        <Input
                          id="fullName"
                          defaultValue={user?.name || ""}
                          placeholder="Enter your full name"
                          className="h-10"
                        />
                      </div>
                    </div>
                    <DialogFooter className="gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsNameDialogOpen(false)}
                        size="sm"
                        className="cursor-pointer"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => {
                          toast.success("Name update coming soon!");
                          setIsNameDialogOpen(false);
                        }}
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Username</Label>
              <div className="flex items-center gap-3">
                <Input
                  value={user?.email?.split("@")[0] || ""}
                  disabled
                  className="flex-1 h-10"
                />
                <Dialog
                  open={isUsernameDialogOpen}
                  onOpenChange={setIsUsernameDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                    >
                      Change username
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader className="pb-2">
                      <DialogTitle className="text-lg">
                        Change username
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-sm">
                          Username
                        </Label>
                        <Input
                          id="username"
                          defaultValue={user?.email?.split("@")[0] || ""}
                          placeholder="Enter your username"
                          className="h-10"
                        />
                      </div>
                    </div>
                    <DialogFooter className="gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsUsernameDialogOpen(false)}
                        size="sm"
                        className="cursor-pointer"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => {
                          toast.success("Username update coming soon!");
                          setIsUsernameDialogOpen(false);
                        }}
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Email</Label>
              <div className="flex items-center gap-3">
                <Input
                  value={user?.email || ""}
                  disabled
                  className="flex-1 h-10"
                />
              </div>
            </div>

            {/* System Section */}
            <div className="pt-8 border-t">
              <h3 className="text-lg font-semibold mb-6">System</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Support</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                  >
                    Contact
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm">
                      You are signed in as{" "}
                      <span className="font-medium">{user?.email}</span>
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={async () => {
                      await authClient.signOut();
                      toast.success("Logged out successfully");
                      router.push("/login");
                    }}
                  >
                    Sign out
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Sign out of all sessions
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Devices or browsers where you are signed in
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                  >
                    Sign out of all sessions
                  </Button>
                </div>

                <Dialog
                  open={isPasswordDialogOpen}
                  onOpenChange={setIsPasswordDialogOpen}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Change password</p>
                      <p className="text-xs text-muted-foreground">
                        Update your password to keep your account secure
                      </p>
                    </div>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                      >
                        Change password
                      </Button>
                    </DialogTrigger>
                  </div>
                  <DialogContent className="sm:max-w-[420px]">
                    <form onSubmit={handleSubmit(onSubmitPasswordChange)}>
                      <DialogHeader className="pb-2">
                        <DialogTitle className="text-lg">
                          Change password
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-5 py-4">
                        {/* Current Password */}
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword" className="text-sm">
                            Current Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showCurrentPassword ? "text" : "password"}
                              placeholder="Enter current password"
                              className="pr-10 h-10"
                              {...register("currentPassword")}
                              disabled={isLoading}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              tabIndex={-1}
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          {errors.currentPassword && (
                            <p className="text-xs text-destructive">
                              {errors.currentPassword.message}
                            </p>
                          )}
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-sm">
                            New Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              className="pr-10 h-10"
                              {...register("newPassword")}
                              disabled={isLoading}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              tabIndex={-1}
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          {errors.newPassword && (
                            <p className="text-xs text-destructive">
                              {errors.newPassword.message}
                            </p>
                          )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-sm">
                            Confirm New Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm new password"
                              className="pr-10 h-10"
                              {...register("confirmPassword")}
                              disabled={isLoading}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              tabIndex={-1}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <p className="text-xs text-destructive">
                              {errors.confirmPassword.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <DialogFooter className="gap-2 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsPasswordDialogOpen(false);
                            reset();
                          }}
                          disabled={isLoading}
                          size="sm"
                          className="cursor-pointer"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          size="sm"
                          className="cursor-pointer"
                        >
                          {isLoading ? "Saving..." : "Save"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Notifications</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Manage how you receive notifications
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b">
                  <div className="flex-1">
                    <p className="font-medium mb-1">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about your bookings
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-500/10 text-blue-600 border-blue-500/20"
                  >
                    Coming Soon
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-4 border-b">
                  <div className="flex-1">
                    <p className="font-medium mb-1">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Get instant updates on your device
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-500/10 text-blue-600 border-blue-500/20"
                  >
                    Coming Soon
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
