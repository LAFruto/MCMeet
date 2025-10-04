"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlarmClock,
  Calendar,
  LogOut,
  Menu,
  Moon,
  Plus,
  Sun,
  User,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { authClient, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function MobileSidebar() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setIsOpen(false);
            toast.success("Logged out successfully");
            router.push("/login");
          },
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  // Get user info from session
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const userAvatar = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (isPending) {
    return null;
  }

  return (
    <div className="flex items-center px-1 py-2 border-b lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="mr-2">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-center gap-2 py-6 border-b">
              <Image
                src="/mcmeet.svg"
                alt="MCMeet Logo"
                className="h-10 w-10"
                width={40}
                height={40}
              />
              <span className="font-bold text-xl">MCMeet</span>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col py-4">
              {/* New Chat Button */}
              <div className="px-4 mb-4">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <Button
                    className="gap-2 rounded-full h-12 w-full cursor-pointer"
                    size="icon"
                    variant="outline"
                  >
                    <Plus className="h-6 w-6" />
                    <span className="text-sm font-medium">New Chat</span>
                  </Button>
                </Link>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 space-y-2 px-4">
                <Link
                  href="/agenda"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted-foreground/10 transition-all duration-200 hover:scale-105 hover:saturate-110"
                >
                  <AlarmClock className="h-5 w-5" />
                  <span className="font-medium">Agenda</span>
                </Link>

                <Link
                  href="/agenda"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted-foreground/10 transition-all duration-200 hover:scale-105 hover:saturate-110"
                >
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">Schedule</span>
                </Link>

                <Link
                  href="/faculty"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted-foreground/10 transition-all duration-200 hover:scale-105 hover:saturate-110"
                >
                  <Users className="h-5 w-5" />
                  <span className="font-medium">Faculty</span>
                </Link>
              </div>

              {/* User Section */}
              <div className="border-t pt-4 px-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 p-3 h-auto"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium">
                        {userAvatar}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{userName}</span>
                        <span className="text-xs text-muted-foreground">
                          {userEmail}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/settings" onClick={() => setIsOpen(false)}>
                        <User className="h-4 w-4 mr-2" />
                        Account Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                    >
                      {theme === "dark" ? (
                        <Sun className="h-4 w-4 mr-2" />
                      ) : (
                        <Moon className="h-4 w-4 mr-2" />
                      )}
                      {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <Link
        href="/"
        className="flex items-center gap-2 hover:scale-105 transition-all duration-200 hover:saturate-110 ease-in-out"
        onClick={() => setIsOpen(false)}
      >
        <Image
          src="/mcmeet.svg"
          alt="MCMeet Logo"
          className="h-8 w-8"
          width={32}
          height={32}
        />
        <span className="font-bold text-lg">MCMeet</span>
      </Link>
    </div>
  );
}
