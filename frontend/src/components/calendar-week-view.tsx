"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Meeting } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit2,
  Filter,
  MapPin,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

interface CalendarWeekViewProps {
  meetings: Meeting[];
  onCreateMeeting?: (meeting: Partial<Meeting>) => void;
}

interface NewMeetingForm {
  title: string;
  type: "meeting" | "event" | "task";
  date: string;
  startTime: string;
  endTime: string;
  note: string;
  location: string;
  link: string;
}

type ViewMode = "day" | "week" | "month";
type ScheduleType = "all" | "meeting" | "event" | "task";
type LocationType = "all" | "online" | "face-to-face";

const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7 AM to 9 PM
const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Placeholder demo events for testing
const PLACEHOLDER_EVENTS: Meeting[] = [
  {
    id: 101,
    title: "Client Meeting",
    facultyId: 1,
    facultyName: "Dr. Sarah Johnson",
    studentId: "demo",
    studentName: "Demo User",
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    startTime: "09:00",
    endTime: "10:00",
    status: "scheduled",
    purpose: "Quarterly review",
    location: "Online",
  },
  {
    id: 102,
    title: "Meetup with Team",
    facultyId: 2,
    facultyName: "Prof. Michael Chen",
    studentId: "demo",
    studentName: "Demo User",
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    startTime: "09:00",
    endTime: "10:00",
    status: "scheduled",
    purpose: "Team sync",
    location: "Room 305",
  },
  {
    id: 103,
    title: "Client Meeting",
    facultyId: 3,
    facultyName: "Dr. Emily Rodriguez",
    studentId: "demo",
    studentName: "Demo User",
    date: new Date(Date.now() + 86400000).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    startTime: "09:30",
    endTime: "10:00",
    status: "scheduled",
    purpose: "Project discussion",
    location: "Online",
  },
];

function getWeekDates(baseDate: Date) {
  const dates = [];
  const currentDay = baseDate.getDay();
  const startOfWeek = new Date(baseDate);
  startOfWeek.setDate(baseDate.getDate() - currentDay);

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    // Normalize to midnight to avoid timezone issues
    const normalizedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    dates.push(normalizedDate);
  }

  return dates;
}

function getMonthDates(baseDate: Date) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const dates = [];

  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i);
    const normalizedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    dates.push(normalizedDate);
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const normalizedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    dates.push(normalizedDate);
  }

  // Next month days
  const remainingDays = 42 - dates.length; // 6 rows x 7 days
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    const normalizedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    dates.push(normalizedDate);
  }

  return dates;
}

function formatDate(date: Date, format: "day" | "date" | "full" | "monthYear") {
  if (format === "day") {
    return WEEKDAYS[date.getDay()];
  }
  if (format === "date") {
    return date.getDate().toString().padStart(2, "0");
  }
  if (format === "monthYear") {
    return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
  }
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

function formatDateKey(date: Date): string {
  // Normalize to local timezone and create a date at midnight
  const normalizedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  return normalizedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatTime12Hour(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

function formatHour12(hour: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12} ${period}`;
}

function getMeetingPosition(
  startTime: string,
  endTime: string,
  viewType: "day" | "week" = "day"
) {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  // Use different row heights based on view type
  const hourRowHeight = viewType === "day" ? 128 : 48; // day: lg:h-32 (128px), week: h-12 (48px)
  const startMinutes = (startHour - 7) * 60 + startMin;
  const endMinutes = (endHour - 7) * 60 + endMin;
  const duration = endMinutes - startMinutes;

  // Position at the top of the hour row + offset for minutes
  const top = (startHour - 7) * hourRowHeight + (startMin / 60) * hourRowHeight;
  const height = (duration / 60) * hourRowHeight;

  return { top, height };
}

function getCurrentTimePosition() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Only show if within our time range (7 AM - 10 PM)
  if (currentHour < 7 || currentHour > 22) return null;

  const hourRowHeight = 128; // Same as day view
  const top =
    (currentHour - 7) * hourRowHeight + (currentMinute / 60) * hourRowHeight;

  return { top };
}

function getMeetingColor(status: string) {
  const colors = {
    scheduled:
      "border-red-300 bg-white dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-red-950/20", // Meetings = Red
    completed:
      "border-blue-300 bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-950/20", // Events = Blue
    cancelled:
      "border-purple-300 bg-white dark:bg-gray-900 hover:bg-purple-50 dark:hover:bg-purple-950/20", // Tasks = Purple
    pending:
      "border-purple-300 bg-white dark:bg-gray-900 hover:bg-purple-50 dark:hover:bg-purple-950/20", // Tasks = Purple
  };
  return colors[status as keyof typeof colors] || colors.scheduled;
}

function getTimeHeaderColor(status: string) {
  const colors = {
    scheduled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300", // Meetings = Red
    completed:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300", // Events = Blue
    cancelled:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300", // Tasks = Purple
    pending:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300", // Tasks = Purple
  };
  return colors[status as keyof typeof colors] || colors.scheduled;
}

// Helper function to capitalize schedule type
function capitalizeScheduleType(scheduleType?: string): string {
  if (!scheduleType) return "Meeting";
  return scheduleType.charAt(0).toUpperCase() + scheduleType.slice(1);
}

// Helper function to format date with (Day), (Month), (Year)
function formatDateWithLabels(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

// Helper function to render user avatars with tooltips
function renderUserAvatars(meeting: Meeting) {
  const attendees = [
    { name: meeting.facultyName, role: "Professor" },
    { name: meeting.studentName, role: "Student" },
  ];

  return (
    <>
      {attendees.slice(0, 3).map((attendee, index) => (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <Avatar className="h-6 w-6 cursor-pointer ring-2 ring-background">
              <AvatarFallback className="text-[10px] bg-purple-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                {attendee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs bg-popover text-popover-foreground shadow-lg border-0">
            <p>
              {attendee.name} ({attendee.role})
            </p>
          </TooltipContent>
        </Tooltip>
      ))}
    </>
  );
}

// Helper to calculate overlapping events
interface MeetingWithPosition extends Meeting {
  column: number;
  totalColumns: number;
}

function calculateOverlaps(meetings: Meeting[]): MeetingWithPosition[] {
  if (meetings.length === 0) return [];

  const sorted = [...meetings].sort((a, b) => {
    const [aHour, aMin] = a.startTime.split(":").map(Number);
    const [bHour, bMin] = b.startTime.split(":").map(Number);
    return aHour * 60 + aMin - (bHour * 60 + bMin);
  });

  const positioned: MeetingWithPosition[] = [];
  const columns: { end: number; meetings: MeetingWithPosition[] }[] = [];

  for (const meeting of sorted) {
    const [startHour, startMin] = meeting.startTime.split(":").map(Number);
    const [endHour, endMin] = meeting.endTime.split(":").map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    // Find available column
    let columnIndex = columns.findIndex((col) => col.end <= startMinutes);

    if (columnIndex === -1) {
      // Create new column
      columnIndex = columns.length;
      columns.push({ end: endMinutes, meetings: [] });
    } else {
      // Update existing column
      columns[columnIndex].end = endMinutes;
    }

    // Create positioned meeting with temporary totalColumns
    const positionedMeeting: MeetingWithPosition = {
      ...meeting,
      column: columnIndex,
      totalColumns: 1, // Will be updated later
    };

    columns[columnIndex].meetings.push(positionedMeeting);
    positioned.push(positionedMeeting);
  }

  // Update totalColumns for all overlapping meetings
  for (const meeting of positioned) {
    const [startHour, startMin] = meeting.startTime.split(":").map(Number);
    const [endHour, endMin] = meeting.endTime.split(":").map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    // Count how many columns have meetings that overlap with this one
    let maxColumns = 0;
    for (const col of columns) {
      const hasOverlap = col.meetings.some((m) => {
        const [mStartHour, mStartMin] = m.startTime.split(":").map(Number);
        const [mEndHour, mEndMin] = m.endTime.split(":").map(Number);
        const mStartMinutes = mStartHour * 60 + mStartMin;
        const mEndMinutes = mEndHour * 60 + mEndMin;

        // Check if meetings overlap
        return mStartMinutes < endMinutes && mEndMinutes > startMinutes;
      });

      if (hasOverlap) maxColumns++;
    }

    meeting.totalColumns = Math.max(maxColumns, 1);
  }

  return positioned;
}

export function CalendarWeekView({
  meetings,
  onCreateMeeting,
}: CalendarWeekViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [openMeetingId, setOpenMeetingId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<
    "event" | "meeting" | "task"
  >("meeting");
  const [isNewSchedulePopoverOpen, setIsNewSchedulePopoverOpen] =
    useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [newMeeting, setNewMeeting] = useState<NewMeetingForm>({
    title: "",
    type: "meeting",
    date: "",
    startTime: "10:00",
    endTime: "11:00",
    note: "",
    location: "",
    link: "",
  });

  // Filter states
  const [scheduleType, setScheduleType] = useState<ScheduleType>("all");
  const [selectedFaculty, setSelectedFaculty] = useState<string[]>([]);
  const [locationType, setLocationType] = useState<LocationType>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Combine real meetings with placeholder events
  const allMeetings = [...meetings, ...PLACEHOLDER_EVENTS];

  // Get unique faculty list
  const facultyList = Array.from(
    new Set(allMeetings.map((m) => m.facultyName))
  ).sort();

  // Helper function to count meetings by type
  const getMeetingCountByType = (type: ScheduleType) => {
    // Get meetings for current view (day/week/month)
    let meetingsToCount = allMeetings;

    if (viewMode === "day") {
      meetingsToCount = getMeetingsForDate(currentDate);
    } else if (viewMode === "week") {
      const weekDates = getWeekDates(currentDate);
      meetingsToCount = weekDates.flatMap((date) => getMeetingsForDate(date));
    } else if (viewMode === "month") {
      const monthDates = getMonthDates(currentDate);
      meetingsToCount = monthDates.flatMap((date) => getMeetingsForDate(date));
    }

    // Apply faculty and location filters (but not schedule type filter)
    meetingsToCount = meetingsToCount.filter((meeting) => {
      // Faculty filter
      if (selectedFaculty.length > 0) {
        if (!selectedFaculty.includes(meeting.facultyName)) {
          return false;
        }
      }

      // Location type filter
      if (locationType !== "all") {
        const isOnline = meeting.location?.toLowerCase().includes("online");
        if (locationType === "online" && !isOnline) {
          return false;
        }
        if (locationType === "face-to-face" && isOnline) {
          return false;
        }
      }

      return true;
    });

    // Count by type
    if (type === "all") return meetingsToCount.length;
    if (type === "task") return 0; // No tasks in current data structure

    return meetingsToCount.filter((meeting) => {
      const meetingType = meeting.status === "completed" ? "event" : "meeting";
      return meetingType === type;
    }).length;
  };

  // Apply filters
  const filteredMeetings = allMeetings.filter((meeting) => {
    // Schedule type filter
    if (scheduleType !== "all") {
      const meetingType = meeting.status === "completed" ? "event" : "meeting";
      if (meetingType !== scheduleType && scheduleType !== "task") {
        return false;
      }
    }

    // Faculty filter
    if (selectedFaculty.length > 0) {
      if (!selectedFaculty.includes(meeting.facultyName)) {
        return false;
      }
    }

    // Location type filter
    if (locationType !== "all") {
      const isOnline = meeting.location?.toLowerCase().includes("online");
      if (locationType === "online" && !isOnline) {
        return false;
      }
      if (locationType === "face-to-face" && isOnline) {
        return false;
      }
    }

    return true;
  });

  // Clear all filters
  function clearFilters() {
    setScheduleType("all");
    setSelectedFaculty([]);
    setLocationType("all");
  }

  // Check if any filters are active (excluding schedule type)
  const hasActiveFilters = selectedFaculty.length > 0 || locationType !== "all";

  const weekDates = viewMode === "week" ? getWeekDates(currentDate) : [];
  const monthDates = viewMode === "month" ? getMonthDates(currentDate) : [];
  const today = new Date();

  const isToday = (date: Date) => date.toDateString() === today.toDateString();

  const isSameMonth = (date: Date) =>
    date.getMonth() === currentDate.getMonth();

  function goToPrevious() {
    const newDate = new Date(currentDate);
    if (viewMode === "day") {
      newDate.setDate(currentDate.getDate() - 1);
    } else if (viewMode === "week") {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  }

  function goToNext() {
    const newDate = new Date(currentDate);
    if (viewMode === "day") {
      newDate.setDate(currentDate.getDate() + 1);
    } else if (viewMode === "week") {
      newDate.setDate(currentDate.getDate() + 7);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  function handleCreateSchedule(date: Date, hour?: number) {
    setSelectedDate(date);
    setSelectedHour(hour || null);
    const timeStr = hour ? `${hour.toString().padStart(2, "0")}:00` : "10:00";
    setNewMeeting({
      ...newMeeting,
      date: date.toISOString().split("T")[0],
      startTime: timeStr,
      endTime: hour ? `${(hour + 1).toString().padStart(2, "0")}:00` : "11:00",
    });
    setIsNewSchedulePopoverOpen(true);
  }

  function handleSaveSchedule() {
    if (onCreateMeeting) {
      onCreateMeeting({
        title: newMeeting.title,
        date: newMeeting.date,
        startTime: newMeeting.startTime,
        endTime: newMeeting.endTime,
        location: newMeeting.location,
        status: "scheduled",
      });
    }
    setIsNewSchedulePopoverOpen(false);
    setNewMeeting({
      title: "",
      type: "meeting",
      date: "",
      startTime: "10:00",
      endTime: "11:00",
      note: "",
      location: "",
      link: "",
    });
  }

  function handleUpdateMeeting() {
    // TODO: Implement update meeting logic
    setEditMode(false);
    setSelectedMeeting(null);
  }

  function handleDeleteMeeting() {
    // TODO: Implement delete meeting logic
    setSelectedMeeting(null);
  }

  function getMeetingsForDate(date: Date) {
    const dateStr = formatDateKey(date);
    return filteredMeetings.filter((m) => m.date === dateStr);
  }

  function renderMeetingPopover(meeting: Meeting) {
    return (
      <>
        <div className="space-y-3 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Edit Schedule</h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 w-full sm:w-20">
                <Edit2 className="h-4 w-4 text-muted-foreground" />
                <Label className="text-xs">Title</Label>
              </div>
              <Input
                defaultValue={meeting.title}
                className="h-8 text-sm flex-1 w-full"
                placeholder="Meeting title"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 w-full sm:w-20">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Label className="text-xs">Type</Label>
              </div>
              <div className="flex gap-2 flex-1 w-full">
                <Button
                  variant={selectedType === "event" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 h-8 text-[10px] sm:text-xs"
                  onClick={() => setSelectedType("event")}
                >
                  Event
                </Button>
                <Button
                  variant={selectedType === "meeting" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 h-8 text-[10px] sm:text-xs"
                  onClick={() => setSelectedType("meeting")}
                >
                  Meeting
                </Button>
                <Button
                  variant={selectedType === "task" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 h-8 text-[10px] sm:text-xs"
                  onClick={() => setSelectedType("task")}
                >
                  Tasks
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 w-full sm:w-20">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <Label className="text-xs">Date</Label>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-8 text-sm flex-1 w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {meeting.date || "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3 text-sm text-muted-foreground">
                    Calendar component would go here
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 w-full sm:w-20">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Label className="text-xs">Time</Label>
              </div>
              <div className="flex items-center gap-2 flex-1 w-full">
                <Input
                  type="time"
                  defaultValue={meeting.startTime}
                  className="h-8 text-sm flex-1"
                />
                <span className="text-xs text-muted-foreground">→</span>
                <Input
                  type="time"
                  defaultValue={meeting.endTime}
                  className="h-8 text-sm flex-1"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
              <div className="flex items-center gap-2 w-full sm:w-20 pt-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Label className="text-xs">Team</Label>
              </div>
              <div className="space-y-2 flex-1 w-full">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md flex-1 min-w-0">
                    <span className="text-sm truncate">
                      {meeting.facultyName}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 cursor-pointer shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md flex-1 min-w-0">
                    <span className="text-sm truncate">
                      {meeting.studentName}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 cursor-pointer shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs cursor-pointer border-dashed"
                >
                  <span className="mr-1">+</span> Add
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 w-full sm:w-20">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Label className="text-xs">Location</Label>
              </div>
              <Input
                defaultValue={meeting.location}
                className="h-8 text-sm flex-1 w-full"
                placeholder="Add location"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 cursor-pointer"
              onClick={() => {
                setEditMode(false);
                setSelectedMeeting(null);
                setOpenMeetingId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="flex-1 cursor-pointer"
              onClick={handleUpdateMeeting}
            >
              Save
            </Button>
          </div>
        </div>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Schedule</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this meeting? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleDeleteMeeting();
                  setIsDeleteDialogOpen(false);
                  setOpenMeetingId(null);
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  function renderDayView() {
    const dayMeetings = getMeetingsForDate(currentDate);
    const positionedMeetings = calculateOverlaps(dayMeetings);

    // Get current time position for today
    const now = new Date();
    const isToday = now.toDateString() === currentDate.toDateString();
    const currentTimePosition = isToday ? getCurrentTimePosition() : null;

    return (
      <div className="flex-1 overflow-auto px-2 sm:px-0">
        <div className="w-full mx-auto">
          <div className="grid grid-cols-[60px_1fr] sm:grid-cols-[80px_1fr]">
            <div className="text-[10px] sm:text-xs text-muted-foreground font-medium p-2">
              GMT+7
            </div>
            <div className="text-center p-2 bg-primary text-primary-foreground">
              <div className="text-[10px] sm:text-xs font-medium">
                {formatDate(currentDate, "day")}
              </div>
              <div className="text-xl sm:text-2xl font-semibold">
                {formatDate(currentDate, "date")}
              </div>
            </div>
          </div>

          <div className="relative w-full">
            <div className="grid grid-cols-[60px_1fr] sm:grid-cols-[80px_1fr]">
              <div className="relative border-r">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="h-24 lg:h-32 flex items-start justify-end pr-1 sm:pr-2 text-[10px] sm:text-xs text-muted-foreground border-b border-border/30"
                  >
                    {formatHour12(hour)}
                  </div>
                ))}
              </div>

              <div className="relative">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="h-12 lg:h-32 border-b border-border/30 hover:bg-muted/20 cursor-pointer transition-colors"
                    onClick={() => handleCreateSchedule(currentDate, hour)}
                  />
                ))}

                {/* Current time indicator */}
                {currentTimePosition && (
                  <div
                    className="absolute left-0 right-0 bg-red-600 h-0.5 z-10 pointer-events-none"
                    style={{ top: `${currentTimePosition.top}px` }}
                  >
                    <div className="absolute -left-1 -top-1 w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                )}

                <div className="absolute inset-0 pointer-events-none">
                  {positionedMeetings.map((meeting) => {
                    const { top, height } = getMeetingPosition(
                      meeting.startTime,
                      meeting.endTime,
                      "day"
                    );

                    // Microsoft-style: Divide space equally among overlapping meetings
                    const widthPercent = 98 / meeting.totalColumns; // Each meeting gets equal share
                    const leftPercent = meeting.column * widthPercent; // Position based on column index

                    return (
                      <Popover
                        key={meeting.id}
                        open={openMeetingId === meeting.id}
                        onOpenChange={(open) => {
                          if (open) {
                            setOpenMeetingId(meeting.id);
                            setSelectedMeeting(meeting);
                            setEditMode(true);
                          } else {
                            setOpenMeetingId(null);
                            setSelectedMeeting(null);
                            setEditMode(false);
                          }
                        }}
                      >
                        <Tooltip>
                          <PopoverTrigger asChild>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "absolute border pointer-events-auto cursor-pointer transition-colors overflow-hidden",
                                  getMeetingColor(meeting.status)
                                )}
                                style={{
                                  top: `${top}px`,
                                  height: `${Math.max(height, 60)}px`,
                                  left: `${leftPercent}%`,
                                  width: `${widthPercent}%`,
                                }}
                              >
                                <div
                                  className={cn(
                                    "text-xs truncate px-2 py-0.5",
                                    getTimeHeaderColor(meeting.status)
                                  )}
                                >
                                  {formatTime12Hour(meeting.startTime)} -{" "}
                                  {formatTime12Hour(meeting.endTime)}
                                </div>
                                <div className="flex items-center justify-between px-2">
                                  <div>
                                    <div className="font-semibold text-sm truncate">
                                      {capitalizeScheduleType(
                                        meeting.scheduleType
                                      )}{" "}
                                      • {meeting.location}
                                    </div>
                                    <div className="flex items-center justify-between -mt-1">
                                      <span className="text-xs text-muted-foreground truncate flex-1">
                                        {meeting.date}
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="flex items-center shrink-0">
                                      {renderUserAvatars(meeting)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TooltipTrigger>
                          </PopoverTrigger>
                          <TooltipContent
                            side="top"
                            className="max-w-xs bg-popover text-popover-foreground shadow-lg border-0"
                          >
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span>
                                  {formatTime12Hour(meeting.startTime)} -{" "}
                                  {formatTime12Hour(meeting.endTime)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span>{meeting.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span>{meeting.facultyName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span>{meeting.studentName}</span>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                        <PopoverContent
                          className="w-96"
                          side="right"
                          align="start"
                        >
                          {renderMeetingPopover(meeting)}
                        </PopoverContent>
                      </Popover>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderWeekView() {
    return (
      <div className="flex-1 overflow-auto px-2 sm:px-0">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[700px] lg:min-w-0">
            <div className="grid grid-cols-[60px_repeat(7,1fr)] sm:grid-cols-[80px_repeat(7,1fr)] gap-px mb-2 sticky top-0 bg-background z-10 pb-2">
              <div className="text-[10px] sm:text-xs text-muted-foreground font-medium p-1 sm:p-2">
                GMT+7
              </div>
              {weekDates.map((date, i) => (
                <div
                  key={i}
                  className={cn(
                    "text-center p-1 sm:p-2 cursor-pointer transition-colors",
                    isToday(date)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                  onClick={() => {
                    setCurrentDate(date);
                    setViewMode("day");
                  }}
                >
                  <div className="text-[10px] sm:text-xs font-medium">
                    {formatDate(date, "day")}
                  </div>
                  <div
                    className={cn(
                      "text-lg sm:text-xl lg:text-2xl font-semibold",
                      isToday(date) ? "" : "text-foreground"
                    )}
                  >
                    {formatDate(date, "date")}
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="grid grid-cols-[60px_repeat(7,1fr)] sm:grid-cols-[80px_repeat(7,1fr)] gap-0">
                <div className="relative border-r">
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="h-12 sm:h-16 lg:h-20 flex items-start justify-end pr-1 sm:pr-2 text-[10px] sm:text-xs text-muted-foreground border-b border-border/30"
                    >
                      {formatHour12(hour)}
                    </div>
                  ))}
                </div>

                {weekDates.map((date, dayIndex) => {
                  const dayMeetings = getMeetingsForDate(date);
                  const positionedMeetings = calculateOverlaps(dayMeetings);
                  const isCurrentDay = isToday(date);

                  return (
                    <div
                      key={dayIndex}
                      className={cn(
                        "relative border-l border-border/30",
                        isCurrentDay && "bg-red-50 dark:bg-red-950/20"
                      )}
                    >
                      {HOURS.map((hour) => (
                        <div
                          key={hour}
                          className="h-12 sm:h-16 lg:h-20 border-b border-border/30 hover:bg-muted/20 cursor-pointer transition-colors"
                          onClick={() => handleCreateSchedule(date, hour)}
                        />
                      ))}

                      <div className="absolute inset-0 pointer-events-none">
                        {positionedMeetings.map((meeting) => {
                          const { top, height } = getMeetingPosition(
                            meeting.startTime,
                            meeting.endTime,
                            "week"
                          );

                          // Microsoft-style: Divide space equally among overlapping meetings
                          const widthPercent = 98 / meeting.totalColumns; // Each meeting gets equal share
                          const leftPercent = meeting.column * widthPercent; // Position based on column index

                          return (
                            <Popover
                              key={meeting.id}
                              open={openMeetingId === meeting.id}
                              onOpenChange={(open) => {
                                if (open) {
                                  setOpenMeetingId(meeting.id);
                                  setSelectedMeeting(meeting);
                                  setEditMode(false);
                                } else {
                                  setOpenMeetingId(null);
                                  setSelectedMeeting(null);
                                  setEditMode(false);
                                }
                              }}
                            >
                              <Tooltip>
                                <PopoverTrigger asChild>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={cn(
                                        "absolute border pointer-events-auto cursor-pointer transition-colors overflow-hidden",
                                        getMeetingColor(meeting.status)
                                      )}
                                      style={{
                                        top: `${top}px`,
                                        height: `${Math.max(height, 60)}px`,
                                        left: `${leftPercent}%`,
                                        width: `${widthPercent}%`,
                                      }}
                                    >
                                      <div
                                        className={cn(
                                          "text-xs truncate px-2 py-0.5",
                                          getTimeHeaderColor(meeting.status)
                                        )}
                                      >
                                        {formatTime12Hour(meeting.startTime)} -{" "}
                                        {formatTime12Hour(meeting.endTime)}
                                      </div>
                                      <div className="flex items-center justify-between px-2">
                                        <div>
                                          <div className="font-semibold text-sm truncate">
                                            {capitalizeScheduleType(
                                              meeting.scheduleType
                                            )}{" "}
                                            • {meeting.location}
                                          </div>
                                          <div className="flex items-center justify-between -mt-1">
                                            <span className="text-xs text-muted-foreground truncate flex-1">
                                              {meeting.date}
                                            </span>
                                          </div>
                                        </div>
                                        <div>
                                          <div className="flex items-center shrink-0">
                                            {renderUserAvatars(meeting)}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                </PopoverTrigger>
                                <TooltipContent
                                  side="top"
                                  className="max-w-xs bg-popover text-popover-foreground shadow-lg border-0"
                                >
                                  <div className="space-y-1 text-sm">
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                                      <span>
                                        {formatTime12Hour(meeting.startTime)} -{" "}
                                        {formatTime12Hour(meeting.endTime)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                                      <span>{meeting.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                                      <span>{meeting.facultyName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4 text-muted-foreground shrink-0" />
                                      <span>{meeting.studentName}</span>
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                              <PopoverContent
                                className="w-96"
                                side="right"
                                align="start"
                              >
                                {renderMeetingPopover(meeting)}
                              </PopoverContent>
                            </Popover>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderMonthView() {
    const weeks = [];
    for (let i = 0; i < monthDates.length; i += 7) {
      weeks.push(monthDates.slice(i, i + 7));
    }

    return (
      <div className="flex-1 overflow-auto px-2 sm:px-0">
        <div className="w-full mx-auto">
          <div className="grid grid-cols-7 gap-px mb-2">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="text-center text-[10px] sm:text-xs font-medium text-muted-foreground p-1 sm:p-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 border overflow-hidden">
            {monthDates.map((date, i) => {
              const dateMeetings = getMeetingsForDate(date);
              const isCurrentMonth = isSameMonth(date);

              return (
                <div
                  key={i}
                  className={cn(
                    "min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] border-r border-b p-1 sm:p-2 cursor-pointer transition-colors",
                    isToday(date)
                      ? "bg-primary/5 border-primary"
                      : "hover:bg-muted/50",
                    !isCurrentMonth && "bg-muted/30 text-muted-foreground",
                    (i + 1) % 7 === 0 && "border-r-0"
                  )}
                  onClick={() => {
                    setCurrentDate(date);
                    setViewMode("day");
                  }}
                >
                  <div
                    className={cn(
                      "text-xs sm:text-sm font-medium mb-1",
                      isToday(date) && "text-primary font-bold"
                    )}
                  >
                    {date.getDate()}
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    {dateMeetings.slice(0, 2).map((meeting) => (
                      <Popover
                        key={meeting.id}
                        open={openMeetingId === meeting.id}
                        onOpenChange={(open) => {
                          if (open) {
                            setOpenMeetingId(meeting.id);
                            setSelectedMeeting(meeting);
                            setEditMode(true);
                          } else {
                            setOpenMeetingId(null);
                            setSelectedMeeting(null);
                            setEditMode(false);
                          }
                        }}
                      >
                        <Tooltip>
                          <PopoverTrigger asChild>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "text-[9px] sm:text-[10px] lg:text-xs p-1 border truncate cursor-pointer transition-colors",
                                  getMeetingColor(meeting.status)
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <div className="font-medium truncate">
                                  <span className="hidden sm:inline">
                                    {formatTime12Hour(meeting.startTime)}{" "}
                                  </span>
                                  {capitalizeScheduleType(meeting.scheduleType)}{" "}
                                  • {meeting.location}
                                </div>
                              </div>
                            </TooltipTrigger>
                          </PopoverTrigger>
                          <TooltipContent
                            side="top"
                            className="max-w-xs bg-popover text-popover-foreground shadow-lg border-0"
                          >
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span>
                                  {formatTime12Hour(meeting.startTime)} -{" "}
                                  {formatTime12Hour(meeting.endTime)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span>{meeting.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span>{meeting.facultyName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span>{meeting.studentName}</span>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                        <PopoverContent
                          className="w-96"
                          side="right"
                          align="start"
                        >
                          {renderMeetingPopover(meeting)}
                        </PopoverContent>
                      </Popover>
                    ))}
                    {dateMeetings.length > 2 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="text-[9px] sm:text-xs text-muted-foreground pl-0.5 sm:pl-1 cursor-pointer hover:text-foreground">
                            +{dateMeetings.length - 2} more
                          </div>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-96"
                          side="right"
                          align="start"
                        >
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm">
                              All Events - {formatDate(date, "full")}
                            </h4>
                            <Separator />
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                              {dateMeetings.slice(2).map((meeting) => (
                                <Popover key={meeting.id}>
                                  <PopoverTrigger asChild>
                                    <div
                                      className={cn(
                                        "rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-all overflow-hidden",
                                        getMeetingColor(meeting.status)
                                      )}
                                      onClick={() => {
                                        setSelectedMeeting(meeting);
                                        setEditMode(true);
                                      }}
                                    >
                                      <div
                                        className={cn(
                                          "text-xs font-semibold px-2 py-1",
                                          getTimeHeaderColor(meeting.status)
                                        )}
                                      >
                                        {formatTime12Hour(meeting.startTime)} -{" "}
                                        {formatTime12Hour(meeting.endTime)}
                                      </div>
                                      <div className="px-2 py-1 space-y-1">
                                        <div className="font-medium text-sm">
                                          {meeting.title}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {capitalizeScheduleType(
                                            meeting.scheduleType
                                          )}{" "}
                                          • {meeting.location}
                                        </div>
                                        <div className="flex items-center -space-x-1">
                                          {renderUserAvatars(meeting)}
                                        </div>
                                      </div>
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-96"
                                    side="right"
                                    align="start"
                                  >
                                    {renderMeetingPopover(meeting)}
                                  </PopoverContent>
                                </Popover>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full w-full overflow-hidden">
        {/* Fixed Header with proper hierarchy */}
        <div className="shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {/* Top Bar - Title, Navigation, and Actions */}
          <div className="flex items-center justify-between px-4 sm:px-6 h-14 border-b">
            {/* Left: Title */}
            <h1 className="text-base sm:text-lg font-semibold min-w-[200px]">
              Schedules
            </h1>

            {/* Center: Date Navigation */}
            <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevious}
                className="h-8 w-8 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-[160px] sm:min-w-[200px] text-center">
                <span className="text-sm font-medium">
                  {viewMode === "month"
                    ? formatDate(currentDate, "monthYear")
                    : formatDate(currentDate, "full")}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
                className="h-8 w-8 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="h-8 px-3 text-xs cursor-pointer hidden sm:flex"
              >
                Today
              </Button>
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 cursor-pointer relative",
                      hasActiveFilters && "text-primary"
                    )}
                  >
                    <Filter className="h-4 w-4" />
                    {hasActiveFilters && (
                      <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-primary rounded-full" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">Filters</h4>
                      {hasActiveFilters && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          Clear all
                        </Button>
                      )}
                    </div>

                    <Separator />

                    {/* Faculty Filter */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Faculty</Label>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {facultyList.map((faculty) => (
                          <div
                            key={faculty}
                            className="flex items-center space-x-2"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFaculty((prev) =>
                                  prev.includes(faculty)
                                    ? prev.filter((f) => f !== faculty)
                                    : [...prev, faculty]
                                );
                              }}
                              className={cn(
                                "flex h-4 w-4 items-center justify-center rounded border cursor-pointer transition-colors shrink-0",
                                selectedFaculty.includes(faculty)
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "border-input"
                              )}
                            >
                              {selectedFaculty.includes(faculty) && (
                                <Check className="h-3 w-3" />
                              )}
                            </button>
                            <label
                              className="text-sm cursor-pointer flex-1"
                              onClick={() => {
                                setSelectedFaculty((prev) =>
                                  prev.includes(faculty)
                                    ? prev.filter((f) => f !== faculty)
                                    : [...prev, faculty]
                                );
                              }}
                            >
                              {faculty}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Location Type Filter */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Location</Label>
                      <div className="flex flex-col gap-1">
                        {(["all", "online", "face-to-face"] as const).map(
                          (type) => (
                            <button
                              key={type}
                              onClick={() => setLocationType(type)}
                              className={cn(
                                "flex items-center justify-start rounded-md px-3 py-2 text-sm transition-colors cursor-pointer",
                                locationType === type
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-muted"
                              )}
                            >
                              <span className="capitalize">
                                {type === "all"
                                  ? "All Locations"
                                  : type === "online"
                                  ? "Online"
                                  : "Face to Face"}
                              </span>
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Second Bar - Tabs and View Modes */}
          <div className="flex items-center justify-between px-4 sm:px-6 h-12">
            {/* Left: Schedule Type Tabs */}
            <Tabs
              value={scheduleType}
              onValueChange={(value) => setScheduleType(value as ScheduleType)}
            >
              <TabsList className="h-8 p-0.5 bg-transparent border">
                <TabsTrigger
                  value="all"
                  className="text-xs h-7 px-3 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-1"
                >
                  All Schedules
                </TabsTrigger>
                <TabsTrigger
                  value="meeting"
                  className="text-xs h-7 px-3 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-1"
                >
                  Meetings
                  <span className="ml-1 h-4 w-4 rounded-full text-[10px] font-semibold pb-0.5 flex items-center justify-center data-[state=active]:bg-background data-[state=active]:text-foreground bg-foreground text-background">
                    {getMeetingCountByType("meeting")}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="event"
                  className="text-xs h-7 px-3 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-1"
                >
                  Events
                  <span className="ml-1 h-4 w-4 rounded-full text-[10px] font-semibold pb-0.5 flex items-center justify-center data-[state=active]:bg-background data-[state=active]:text-foreground bg-foreground text-background">
                    {getMeetingCountByType("event")}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="task"
                  className="text-xs h-7 px-3 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-1"
                >
                  Tasks
                  <span className="ml-1 h-4 w-4 rounded-full text-[10px] font-semibold pb-0.5 flex items-center justify-center data-[state=active]:bg-background data-[state=active]:text-foreground bg-foreground text-background">
                    {getMeetingCountByType("task")}
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Right: View Mode Buttons */}
            <div className="flex items-center gap-1 border rounded-md p-0.5">
              <Button
                variant={viewMode === "day" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-3 cursor-pointer text-xs"
                onClick={() => setViewMode("day")}
              >
                Day
              </Button>
              <Button
                variant={viewMode === "week" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-3 cursor-pointer text-xs"
                onClick={() => setViewMode("week")}
              >
                Week
              </Button>
              <Button
                variant={viewMode === "month" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-3 cursor-pointer text-xs"
                onClick={() => setViewMode("month")}
              >
                Month
              </Button>
            </div>
          </div>

          {/* Third Bar - Active Filters (shown when specific tab is selected OR filters are active) */}
          {hasActiveFilters && (
            <div className="px-4 sm:px-6 py-2 border-t bg-muted/30">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Active filters:
                </span>
                {selectedFaculty.map((faculty) => (
                  <Badge
                    key={faculty}
                    variant="secondary"
                    className="text-xs gap-1 cursor-pointer h-6"
                    onClick={() =>
                      setSelectedFaculty((prev) =>
                        prev.filter((f) => f !== faculty)
                      )
                    }
                  >
                    {faculty}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
                {locationType !== "all" && (
                  <Badge
                    variant="secondary"
                    className="text-xs gap-1 cursor-pointer h-6"
                    onClick={() => setLocationType("all")}
                  >
                    {locationType === "online" ? "Online" : "Face to Face"}
                    <X className="h-3 w-3" />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Calendar Views */}
        {viewMode === "day" && renderDayView()}
        {viewMode === "week" && renderWeekView()}
        {viewMode === "month" && renderMonthView()}
      </div>
    </TooltipProvider>
  );
}
