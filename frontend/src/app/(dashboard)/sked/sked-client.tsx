"use client";

import { usePageContext } from "@/lib/hooks/use-chat";
import { CalendarWeekView } from "@/components/calendar-week-view";
import type { Meeting } from "@/lib/types";

interface SkedClientProps {
  meetings: Meeting[];
}

export function SkedClient({ meetings }: SkedClientProps) {
  usePageContext("sked");

  return (
    <div className="flex-1 flex flex-col h-full">
      <CalendarWeekView meetings={meetings} />
    </div>
  );
}
