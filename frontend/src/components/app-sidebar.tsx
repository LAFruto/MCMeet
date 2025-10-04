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
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient, useSession } from "@/lib/auth-client";
import {
  AlarmClock,
  Calendar,
  LogOut,
  Moon,
  Plus,
  Shield,
  Sun,
  User,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useChatStore } from "@/lib/stores/chat-store";

export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const clearMessages = useChatStore((state) => state.clearMessages);

  const handleNewChat = () => {
    clearMessages();
    router.push("/");
    toast.success("Started new chat");
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
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
  const userRole = (session?.user as any)?.role || "student";
  const isAdmin = userRole === "admin";
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
    <Sidebar className="hidden lg:flex border-r z-10" collapsible="none">
      <SidebarHeader>
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 py-3 hover:scale-105 transition-all duration-200 hover:saturate-110 ease-in-out"
        >
          <Image
            src="/mcmeet.svg"
            alt="MCMeet Logo"
            className="h-12 w-12"
            width={48}
            height={48}
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* New Chat Button */}
        <div className="p-4">
          <Button
            onClick={handleNewChat}
            className="gap-2 rounded-full h-12 w-full cursor-pointer hover:scale-105 transition-all duration-200 hover:saturate-110 ease-in-out"
            size="icon"
            variant="outline"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  className="flex flex-col items-center justify-center"
                >
                  <Link href="/agenda">
                    <div className="h-10 w-10 flex flex-col items-center justify-center hover:bg-muted-foreground/10  rounded-md hover:scale-105 transition-all duration-200 hover:saturate-110 ease-in-out">
                      <AlarmClock />
                    </div>
                    <span className="text-xs">Agenda</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Admin-only: Sked */}
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    size="lg"
                    className="flex flex-col items-center justify-center text-center"
                  >
                    <Link href="/sked">
                      <div className="h-10 w-10 flex flex-col items-center justify-center text-center hover:bg-muted-foreground/10  rounded-md hover:scale-105 transition-all duration-200 hover:saturate-110 ease-in-out">
                        <Calendar />
                      </div>
                      <span className="text-xs text-center">Sked</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Admin-only: Faculty */}
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    size="lg"
                    className="flex flex-col items-center justify-center text-center"
                  >
                    <Link href="/faculty">
                      <div className="h-10 w-10 flex flex-col items-center justify-center text-center hover:bg-muted-foreground/10 rounded-md hover:scale-105 transition-all duration-200 hover:saturate-110 ease-in-out">
                        <Users />
                      </div>
                      <span className="text-xs">Faculty</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="w-full h-full flex flex-col items-center justify-start"
                  size="lg"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium">
                    {userAvatar}
                  </div>
                  <span className="text-xs">Account</span>
                  {/* <ChevronDown className="h-4 w-4" /> */}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="ml-2 w-56" align="end">
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <User className="h-4 w-4 mr-2" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
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
                <DropdownMenuSeparator />
                <div className="flex items-center gap-2 px-1 py-1">
                  <div className="flex flex-row h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium">
                    {userAvatar}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {userEmail}
                    </span>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
