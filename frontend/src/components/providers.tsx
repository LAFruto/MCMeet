"use client";

import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useSession } from "@/lib/auth-client";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Call profile sync once per session when user is logged in
  const { data: session } = useSession();
  const didSyncRef = useRef(false);

  useEffect(() => {
    if (!session?.user?.id) return;
    if (didSyncRef.current) return;
    didSyncRef.current = true;

    // Fire and forget; backend no-ops if no Microsoft token
    fetch("/api/auth/sync-microsoft-profile", { method: "POST" }).catch(() => {
      // Intentionally ignore errors; optional enrichment
    });
  }, [session?.user?.id]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster position="bottom-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
