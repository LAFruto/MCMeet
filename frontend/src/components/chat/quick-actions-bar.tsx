"use client";

import { useChatStore } from "@/lib/stores/chat-store";
import {
  CalendarPlus,
  Clock,
  CalendarCheck,
  XCircle,
  Users,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

export function QuickActionsBar() {
  const { setInput, isLoading } = useChatStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto px-3 md:px-0">
      <div className="flex flex-wrap gap-2 justify-center">
        {QUICK_ACTIONS.map(({ id, label, icon: Icon, template }, index) => (
          <button
            key={id}
            disabled={isLoading}
            onClick={() => setInput(template)}
            style={{ animationDelay: `${index * 50}ms` }}
            className={`inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-xs md:text-sm text-foreground/80 hover:bg-muted/50 hover:border-primary/50 hover:shadow-md disabled:opacity-50 transition-all hover:scale-105 active:scale-95 ${
              mounted ? "animate-fade-in-up" : "opacity-0 translate-y-5"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.split(" ")[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "book",
    label: "Book Meeting",
    icon: CalendarPlus,
    template: "I'd like to book a meeting with a faculty member",
  },
  {
    id: "avail",
    label: "Availability",
    icon: Clock,
    template: "Check faculty availability for this week",
  },
  {
    id: "resched",
    label: "Reschedule",
    icon: CalendarCheck,
    template: "I need to reschedule my existing meeting",
  },
  {
    id: "cancel",
    label: "Cancel",
    icon: XCircle,
    template: "Cancel my scheduled meeting",
  },
  {
    id: "faculty",
    label: "Faculty Info",
    icon: Users,
    template: "Show me information about faculty members",
  },
  {
    id: "calendar",
    label: "Academic Calendar",
    icon: BookOpen,
    template: "Show me the academic calendar",
  },
];

interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  template: string;
}
