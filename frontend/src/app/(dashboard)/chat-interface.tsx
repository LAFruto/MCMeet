"use client";

import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatMessages } from "@/components/chat/chat-messages";
import { QuickActionsBar } from "@/components/chat/quick-actions-bar";
import { useChatStore } from "@/lib/stores/chat-store";
import { useEffect, useState } from "react";

export function ChatInterface() {
  const { selectedQuickAction, messages } = useChatStore();
  const [mounted, setMounted] = useState(false);
  const [hasMessages, setHasMessages] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setHasMessages(messages.length > 1);
    }
  }, [mounted, messages.length]);

  function getTitle() {
    if (!selectedQuickAction) return "How can I help you today?";

    switch (selectedQuickAction) {
      case "Book Meeting":
        return "Let's book your meeting!";
      case "Check Availability":
        return "Checking faculty availability...";
      case "Reschedule":
        return "Let's reschedule your meeting!";
      case "Cancel Booking":
        return "I'll help you cancel your booking!";
      case "Faculty Info":
        return "Here's the faculty information!";
      case "Academic Calendar":
        return "Here's the academic calendar!";
      default:
        return "How can I help you today?";
    }
  }

  // Prevent hydration mismatch by rendering consistent initial state
  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-6 md:px-6 md:py-12">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12 opacity-0">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {getTitle()}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto mb-8">
              I'm your AI assistant for scheduling faculty meetings, checking
              availability, and managing your academic appointments.
            </p>
            <div className="max-w-3xl mx-auto">
              <ChatComposer fixed={false} />
            </div>
          </div>
          <QuickActionsBar />
        </div>
      </div>
    );
  }

  return (
    <>
      {hasMessages ? (
        <>
          <div className="flex-1 overflow-hidden">
            <ChatMessages />
          </div>
          <ChatComposer fixed />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center px-4 py-6 md:px-6 md:py-12">
          <div className="w-full max-w-4xl mx-auto">
            <div
              className={`text-center mb-8 md:mb-12 transition-all duration-500 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {getTitle()}
              </h1>
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto mb-8">
                I'm your AI assistant for scheduling faculty meetings, checking
                availability, and managing your academic appointments.
              </p>
              <div className="max-w-3xl mx-auto">
                <ChatComposer fixed={false} />
              </div>
            </div>
            <QuickActionsBar />
          </div>
        </div>
      )}
    </>
  );
}
