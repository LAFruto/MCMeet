"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChatSessionLoader } from "@/components/chat-session-loader";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
}

export function DashboardLayoutClient({
  children,
}: DashboardLayoutClientProps) {
  return (
    <SidebarProvider>
      <ChatSessionLoader />
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <MobileSidebar />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
