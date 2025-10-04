/**
 * Minimalist Agenda View Component (Read-only)
 */

"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Meeting } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import type { AgendaViewState, AgendaEvent, AgendaStats } from "./types";
import { AGENDA_CONSTANTS, AGENDA_LABELS, AGENDA_MESSAGES } from "./constants";
import {
  formatDateKey,
  getWeekDates,
  getMonthDates,
  normalizeDate,
  getEventColor,
  formatTime,
  formatDate,
} from "./utils";

interface AgendaViewProps {
  meetings: Meeting[];
  viewState: AgendaViewState;
  onNavigatePrevious: () => void;
  onNavigateNext: () => void;
  onNavigateToday: () => void;
  onChangeViewMode: (mode: "day" | "week" | "month") => void;
  stats: AgendaStats;
  currentTimePosition: number;
}

/**
 * Minimalist Agenda View Component
 *
 * A clean, read-only view of the user's schedule.
 * No editing capabilities, focused on viewing and navigation.
 */
export function AgendaView({
  meetings,
  viewState,
  onNavigatePrevious,
  onNavigateNext,
  onNavigateToday,
  onChangeViewMode,
  stats,
  currentTimePosition,
}: AgendaViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null);

  // Transform meetings to agenda events
  const agendaEvents: AgendaEvent[] = meetings.map((meeting) => ({
    id: meeting.id.toString(),
    title: meeting.title,
    startTime: new Date(meeting.startTime),
    endTime: new Date(meeting.endTime),
    type: (meeting.scheduleType as "meeting" | "event" | "task") || "meeting",
    location: meeting.location,
    description: meeting.purpose || "",
    attendees: [meeting.facultyName, meeting.studentName].filter(Boolean),
    color: getEventColor(
      (meeting.scheduleType as "meeting" | "event" | "task") || "meeting"
    ),
    status: "confirmed",
  }));

  /**
   * Render detailed event popover
   */
  const renderEventPopover = () => {
    if (!selectedEvent) return null;

    return (
      <Popover
        open={!!selectedEvent}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                style={{ backgroundColor: selectedEvent.color }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">
                  {selectedEvent.title}
                </h3>
                <p className="text-xs text-muted-foreground capitalize">
                  {selectedEvent.type}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>
                  {formatTime(selectedEvent.startTime)} -{" "}
                  {formatTime(selectedEvent.endTime)}
                </span>
              </div>

              {selectedEvent.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate">{selectedEvent.location}</span>
                </div>
              )}

              {selectedEvent.attendees &&
                selectedEvent.attendees.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">
                      {selectedEvent.attendees.join(", ")}
                    </span>
                  </div>
                )}

              {selectedEvent.description && (
                <div className="text-sm text-muted-foreground">
                  <p className="line-clamp-3">{selectedEvent.description}</p>
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  /**
   * Render current time indicator
   */
  const renderCurrentTimeIndicator = () => {
    if (currentTimePosition < 0) return null;

    return (
      <div
        className="absolute left-0 right-0 z-20 h-0.5 bg-red-600"
        style={{ top: `${currentTimePosition}px` }}
      >
        <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-red-600" />
      </div>
    );
  };

  /**
   * Render day view
   */
  const renderDayView = () => {
    const currentDate = viewState.currentDate;
    const dayEvents = agendaEvents.filter(
      (event) => formatDateKey(event.startTime) === formatDateKey(currentDate)
    );

    return (
      <div className="flex h-full">
        {/* Time column */}
        <div className="w-16 border-r border-border">
          <div className="h-12 border-b border-border" />
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="h-12 border-b border-dashed border-muted-foreground/20 flex items-start justify-center pt-1"
            >
              <span className="text-xs text-muted-foreground">
                {8 + i === 12
                  ? "12 PM"
                  : 8 + i > 12
                  ? `${8 + i - 12} PM`
                  : `${8 + i} AM`}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar content */}
        <div className="flex-1 relative">
          {/* Current time indicator */}
          {renderCurrentTimeIndicator()}

          {/* Time slots */}
          <div className="h-12 border-b border-border" />
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="h-12 border-b border-dashed border-muted-foreground/10 relative"
            />
          ))}

          {/* Events */}
          {dayEvents.map((event) => {
            const startHour = event.startTime.getHours();
            const startMinute = event.startTime.getMinutes();
            const endHour = event.endTime.getHours();
            const endMinute = event.endTime.getMinutes();

            const startMinutes = startHour * 60 + startMinute;
            const endMinutes = endHour * 60 + endMinute;
            const durationMinutes = endMinutes - startMinutes;

            const workingStartMinutes =
              AGENDA_CONSTANTS.WORKING_HOURS.START * 60;
            const relativeStartMinutes = Math.max(
              0,
              startMinutes - workingStartMinutes
            );

            const top =
              (relativeStartMinutes / 60) * AGENDA_CONSTANTS.ROW_HEIGHTS.DAY;
            const height = Math.max(
              20,
              (durationMinutes / 60) * AGENDA_CONSTANTS.ROW_HEIGHTS.DAY
            );

            return (
              <Popover key={event.id}>
                <PopoverTrigger asChild>
                  <div
                    className="absolute left-1 right-1 rounded-md border border-border/50 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      backgroundColor: event.color + "15",
                      borderColor: event.color + "40",
                    }}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="p-2 h-full flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: event.color }}
                          />
                          <span className="text-sm font-medium truncate">
                            {event.title}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatTime(event.startTime)}
                        </span>
                      </div>

                      {event.location && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="start">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                        style={{ backgroundColor: event.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                          {event.title}
                        </h3>
                        <p className="text-xs text-muted-foreground capitalize">
                          {event.type}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {formatTime(event.startTime)} -{" "}
                          {formatTime(event.endTime)}
                        </span>
                      </div>

                      {event.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}

                      {event.attendees && event.attendees.length > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="truncate">
                            {event.attendees.join(", ")}
                          </span>
                        </div>
                      )}

                      {event.description && (
                        <div className="text-sm text-muted-foreground">
                          <p className="line-clamp-3">{event.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
      </div>
    );
  };

  /**
   * Render week view
   */
  const renderWeekView = () => {
    const weekDates = getWeekDates(viewState.currentDate);
    const today = normalizeDate(new Date());

    return (
      <div className="flex h-full">
        {/* Time column */}
        <div className="w-16 border-r border-border">
          <div className="h-12 border-b border-border" />
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="h-10 border-b border-dashed border-muted-foreground/20 flex items-start justify-center pt-1"
            >
              <span className="text-xs text-muted-foreground">
                {8 + i === 12
                  ? "12 PM"
                  : 8 + i > 12
                  ? `${8 + i - 12} PM`
                  : `${8 + i} AM`}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex-1">
          {/* Header row */}
          <div className="h-12 border-b border-border grid grid-cols-7">
            {weekDates.map((date, index) => (
              <div
                key={index}
                className={cn(
                  "flex flex-col items-center justify-center border-r border-border last:border-r-0",
                  formatDateKey(date) === formatDateKey(today) && "bg-muted/50"
                )}
              >
                <span className="text-xs text-muted-foreground">
                  {AGENDA_CONSTANTS.DAYS_OF_WEEK[date.getDay()].slice(0, 3)}
                </span>
                <span className="text-sm font-medium">{date.getDate()}</span>
              </div>
            ))}
          </div>

          {/* Calendar rows */}
          {Array.from({ length: 12 }, (_, hourIndex) => (
            <div
              key={hourIndex}
              className="h-10 border-b border-dashed border-muted-foreground/10 grid grid-cols-7"
            >
              {weekDates.map((date, dayIndex) => {
                const dayEvents = agendaEvents.filter(
                  (event) =>
                    formatDateKey(event.startTime) === formatDateKey(date)
                );

                const hourEvents = dayEvents.filter((event) => {
                  const eventHour = event.startTime.getHours();
                  return eventHour === 8 + hourIndex;
                });

                return (
                  <div
                    key={dayIndex}
                    className="border-r border-dashed border-muted-foreground/10 last:border-r-0 relative"
                  >
                    {hourEvents.map((event) => (
                      <Popover key={event.id}>
                        <PopoverTrigger asChild>
                          <div
                            className="absolute inset-1 rounded-sm cursor-pointer hover:shadow-sm transition-shadow"
                            style={{
                              backgroundColor: event.color + "20",
                              borderLeft: `3px solid ${event.color}`,
                            }}
                            onClick={() => setSelectedEvent(event)}
                          >
                            <div className="p-1 h-full flex flex-col justify-center">
                              <span className="text-xs font-medium truncate">
                                {event.title}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatTime(event.startTime)}
                              </span>
                            </div>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4" align="start">
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div
                                className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                                style={{ backgroundColor: event.color }}
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm truncate">
                                  {event.title}
                                </h3>
                                <p className="text-xs text-muted-foreground capitalize">
                                  {event.type}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span>
                                  {formatTime(event.startTime)} -{" "}
                                  {formatTime(event.endTime)}
                                </span>
                              </div>

                              {event.location && (
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="w-4 h-4 text-muted-foreground" />
                                  <span className="truncate">
                                    {event.location}
                                  </span>
                                </div>
                              )}

                              {event.attendees &&
                                event.attendees.length > 0 && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Users className="w-4 h-4 text-muted-foreground" />
                                    <span className="truncate">
                                      {event.attendees.join(", ")}
                                    </span>
                                  </div>
                                )}

                              {event.description && (
                                <div className="text-sm text-muted-foreground">
                                  <p className="line-clamp-3">
                                    {event.description}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Render month view
   */
  const renderMonthView = () => {
    const monthDates = getMonthDates(viewState.currentDate);

    return (
      <div className="grid grid-cols-7 h-full">
        {/* Header */}
        {AGENDA_CONSTANTS.DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="h-10 border-b border-r border-border last:border-r-0 flex items-center justify-center"
          >
            <span className="text-xs font-medium text-muted-foreground">
              {day.slice(0, 3)}
            </span>
          </div>
        ))}

        {/* Calendar days */}
        {monthDates.map((date, index) => {
          const dayEvents = agendaEvents.filter(
            (event) =>
              formatDateKey(event.startTime) === formatDateKey(date.date)
          );

          return (
            <div
              key={index}
              className={cn(
                "border-b border-r border-border last:border-r-0 p-1 min-h-[120px]",
                !date.isCurrentMonth && "bg-muted/30",
                date.isToday && "bg-primary/10"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={cn(
                    "text-sm",
                    !date.isCurrentMonth && "text-muted-foreground",
                    date.isToday && "font-bold text-primary"
                  )}
                >
                  {date.dayOfMonth}
                </span>
                {dayEvents.length > 0 && (
                  <Badge variant="secondary" className="text-xs h-5">
                    {dayEvents.length}
                  </Badge>
                )}
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <Popover key={event.id}>
                    <PopoverTrigger asChild>
                      <div
                        className="text-xs p-1 rounded-sm truncate cursor-pointer hover:shadow-sm transition-shadow"
                        style={{
                          backgroundColor: event.color + "20",
                          borderLeft: `2px solid ${event.color}`,
                        }}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <span className="font-medium">{event.title}</span>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4" align="start">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                            style={{ backgroundColor: event.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm truncate">
                              {event.title}
                            </h3>
                            <p className="text-xs text-muted-foreground capitalize">
                              {event.type}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {formatTime(event.startTime)} -{" "}
                              {formatTime(event.endTime)}
                            </span>
                          </div>

                          {event.location && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}

                          {event.attendees && event.attendees.length > 0 && (
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span className="truncate">
                                {event.attendees.join(", ")}
                              </span>
                            </div>
                          )}

                          {event.description && (
                            <div className="text-sm text-muted-foreground">
                              <p className="line-clamp-3">
                                {event.description}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 h-12 border-b">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">
              {AGENDA_LABELS.MY_SCHEDULE}
            </h1>
          </div>

          {/* View mode buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant={viewState.viewMode === "day" ? "default" : "ghost"}
              size="sm"
              onClick={() => onChangeViewMode("day")}
              className="cursor-pointer"
            >
              {AGENDA_LABELS.DAY_VIEW}
            </Button>
            <Button
              variant={viewState.viewMode === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => onChangeViewMode("week")}
              className="cursor-pointer"
            >
              {AGENDA_LABELS.WEEK_VIEW}
            </Button>
            <Button
              variant={viewState.viewMode === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => onChangeViewMode("month")}
              className="cursor-pointer"
            >
              {AGENDA_LABELS.MONTH_VIEW}
            </Button>
          </div>
        </div>

        {/* Navigation bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 h-10">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigatePrevious}
              className="cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateToday}
              className="cursor-pointer"
            >
              {AGENDA_LABELS.TODAY}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateNext}
              className="cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium ml-2">
              {formatDate(viewState.currentDate)}
            </span>
          </div>
        </div>

        {/* Schedule type tabs */}
      </div>

      {/* Calendar content */}
      <div className="flex-1 overflow-hidden">
        {viewState.viewMode === "day" && renderDayView()}
        {viewState.viewMode === "week" && renderWeekView()}
        {viewState.viewMode === "month" && renderMonthView()}
      </div>
    </div>
  );
}
