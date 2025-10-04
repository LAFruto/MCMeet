"use client";

import { usePageContext } from "@/lib/hooks/use-chat";
import { CalendarWeekView } from "@/components/calendar-week-view";
import type { Meeting } from "@/lib/types";

interface AgendaClientProps {
  meetings: Meeting[];
}

export function AgendaClient({ meetings }: AgendaClientProps) {
  usePageContext("agenda");

  return <CalendarWeekView meetings={meetings} />;
}
