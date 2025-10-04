"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="1" y="1" width="10" height="10" fill="#f25022" />
      <rect x="13" y="1" width="10" height="10" fill="#00a4ef" />
      <rect x="1" y="13" width="10" height="10" fill="#7fba00" />
      <rect x="13" y="13" width="10" height="10" fill="#ffb900" />
    </svg>
  );
}

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema | typeof signUpSchema>>({
    resolver: zodResolver(isLogin ? signInSchema : signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: any) => {
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await authClient.signIn.email({
          email: values.email,
          password: values.password,
          callbackURL: "/",
        });

        if (result.error) {
          toast.error(result.error.message || "Failed to sign in");
          setIsLoading(false);
          return;
        }

        toast.success("Signed in successfully!");
        // Keep loading state true while redirecting
        router.push("/");
      } else {
        const result = await authClient.signUp.email({
          email: values.email,
          password: values.password,
          name: values.name,
          callbackURL: "/",
        });

        if (result.error) {
          toast.error(result.error.message || "Failed to create account");
          setIsLoading(false);
          return;
        }

        toast.success("Account created successfully!");
        // Keep loading state true while redirecting
        router.push("/");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast.error(
        error.message || "An error occurred. Please check your connection."
      );
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
    }
  };

  const handleMicrosoftSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "microsoft",
        callbackURL: "/",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Microsoft");
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    form.reset();
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setIsResetting(true);
    try {
      await authClient.forgetPassword({
        email: resetEmail,
        redirectTo: "/reset-password",
      });
      toast.success("Password reset link sent! Check your email.");
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="w-full max-w-md px-4">
      <Card className="border-0 shadow-md">
        <CardHeader className="text-center space-y-2 pb-3 pt-6">
          <div className="flex justify-center">
            <div className="relative w-14 h-14 md:w-16 md:h-16">
              <Image
                src="/mcmeet.svg"
                alt="MCMeet Logo"
                width={64}
                height={64}
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl md:text-3xl font-bold text-primary">
              {isLogin ? "Welcome Back" : "Get Started"}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {isLogin
                ? "Sign in to access your MCMeet account"
                : "Create your MCMeet account to get started"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 px-4 pb-6 md:px-6 md:pb-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 md:space-y-3"
            >
              {!isLogin && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs md:text-sm font-medium">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                          <Input
                            placeholder="John Doe"
                            className="pl-9 md:pl-10 h-9 md:h-10 text-sm"
                            disabled={isLoading}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs md:text-sm font-medium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          className="pl-9 md:pl-10 h-9 md:h-10 text-sm"
                          disabled={isLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs md:text-sm font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-9 pr-9 md:pl-10 md:pr-10 h-9 md:h-10 text-sm"
                          disabled={isLoading}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-9 w-9 md:h-10 md:w-10 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isLogin && (
                <div className="flex items-center justify-end">
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 text-xs text-primary hover:text-primary/80 font-medium h-auto cursor-pointer"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </Button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-9 md:h-10 bg-primary hover:bg-primary/90 transition-all font-semibold text-sm md:text-base !mt-4 md:!mt-5 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Please wait...</span>
                  </div>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>

          <div className="relative py-3">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-9 md:h-10 hover:bg-accent transition-all text-xs md:text-sm cursor-pointer"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <GoogleIcon className="mr-1.5 h-4 w-4" />
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full h-9 md:h-10 hover:bg-accent transition-all text-xs md:text-sm cursor-pointer"
              onClick={handleMicrosoftSignIn}
              disabled={isLoading}
            >
              <MicrosoftIcon className="mr-1.5 h-4 w-4" />
              Microsoft
            </Button>
          </div>

          <div className="text-center pt-3">
            {isLogin ? (
              <p className="text-muted-foreground text-xs md:text-sm">
                Don't have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-primary hover:text-primary/80 font-semibold text-xs md:text-sm cursor-pointer"
                  onClick={toggleMode}
                  disabled={isLoading}
                >
                  Sign up
                </Button>
              </p>
            ) : (
              <p className="text-muted-foreground text-xs md:text-sm">
                Already have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-primary hover:text-primary/80 font-semibold text-xs md:text-sm cursor-pointer"
                  onClick={toggleMode}
                  disabled={isLoading}
                >
                  Sign in
                </Button>
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your
              password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="reset-email"
                className="text-sm font-medium leading-none"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-9 h-10"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  disabled={isResetting}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                setShowForgotPassword(false);
                setResetEmail("");
              }}
              disabled={isResetting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="cursor-pointer"
              onClick={handleForgotPassword}
              disabled={isResetting || !resetEmail}
            >
              {isResetting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
