"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  User,
  BookOpen,
  GraduationCap,
  Building,
  Star,
} from "lucide-react";
import { MarkdownRenderer } from "./markdown-renderer";

interface RichMessageData {
  type: "structured";
  content: string;
  components: RichComponent[];
  metadata?: Record<string, any>;
}

interface RichComponent {
  type:
    | "faculty_card"
    | "timetable"
    | "booking_card"
    | "availability"
    | "action_buttons";
  data: any;
}

interface FacultyCardData {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone?: string;
  office?: string;
  officeHours?: string;
  specialties?: string[];
  rating?: number;
  avatar?: string;
}

interface TimetableData {
  title: string;
  week: string;
  slots: {
    day: string;
    time: string;
    subject: string;
    location: string;
    available: boolean;
  }[];
}

interface BookingCardData {
  id: string;
  faculty: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  status: "pending" | "confirmed" | "cancelled";
  notes?: string;
}

interface AvailabilityData {
  faculty: string;
  date: string;
  availableSlots: {
    time: string;
    duration: number;
    location: string;
  }[];
}

interface ActionButtonsData {
  actions: {
    label: string;
    action: string;
    variant?: "default" | "secondary" | "outline";
  }[];
}

interface RichMessageRendererProps {
  message: string;
  isUser?: boolean;
}

export function RichMessageRenderer({
  message,
  isUser,
}: RichMessageRendererProps) {
  if (isUser) {
    return <MarkdownRenderer content={message} isUser={isUser} />;
  }

  try {
    const data: RichMessageData = JSON.parse(message);

    if (data.type === "structured") {
      return (
        <div className="space-y-4">
          {/* Main content */}
          <MarkdownRenderer content={data.content} isUser={isUser} />

          {/* Rich components */}
          {data.components.map((component, index) => (
            <div key={index}>{renderComponent(component)}</div>
          ))}
        </div>
      );
    }
  } catch (error) {
    // Fallback to regular markdown if not structured
    return <MarkdownRenderer content={message} isUser={isUser} />;
  }

  return <MarkdownRenderer content={message} isUser={isUser} />;
}

function renderComponent(component: RichComponent) {
  switch (component.type) {
    case "faculty_card":
      return <FacultyCard data={component.data as FacultyCardData} />;
    case "timetable":
      return <Timetable data={component.data as TimetableData} />;
    case "booking_card":
      return <BookingCard data={component.data as BookingCardData} />;
    case "availability":
      return <Availability data={component.data as AvailabilityData} />;
    case "action_buttons":
      return <ActionButtons data={component.data as ActionButtonsData} />;
    default:
      return null;
  }
}

function FacultyCard({ data }: { data: FacultyCardData }) {
  const initials = data.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">{data.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{data.position}</p>
            <div className="flex items-center gap-1 mt-1">
              <Building className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {data.department}
              </span>
            </div>
          </div>
          {data.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{data.rating}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{data.email}</span>
          </div>
          {data.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{data.phone}</span>
            </div>
          )}
          {data.office && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{data.office}</span>
            </div>
          )}
          {data.officeHours && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{data.officeHours}</span>
            </div>
          )}
        </div>

        {data.specialties && data.specialties.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Specialties
            </p>
            <div className="flex flex-wrap gap-1">
              {data.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Timetable({ data }: { data: TimetableData }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {data.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{data.week}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.slots.map((slot, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 rounded-lg border"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant={slot.available ? "default" : "secondary"}>
                    {slot.day}
                  </Badge>
                  <span className="font-medium">{slot.time}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {slot.subject}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {slot.location}
                </div>
                <Badge
                  variant={slot.available ? "default" : "outline"}
                  className="mt-1"
                >
                  {slot.available ? "Available" : "Booked"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function BookingCard({ data }: { data: BookingCardData }) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Meeting with {data.faculty}</CardTitle>
          <Badge className={statusColors[data.status]}>
            {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{data.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {data.time} ({data.duration} min)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{data.location}</span>
          </div>
        </div>

        {data.notes && (
          <div>
            <Separator className="my-2" />
            <p className="text-sm text-muted-foreground">{data.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Availability({ data }: { data: AvailabilityData }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Available Times - {data.faculty}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{data.date}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {data.availableSlots.map((slot, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border border-green-200 bg-green-50"
            >
              <div className="font-medium text-sm">{slot.time}</div>
              <div className="text-xs text-muted-foreground">
                {slot.duration} min • {slot.location}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ActionButtons({ data }: { data: ActionButtonsData }) {
  return (
    <div className="flex flex-wrap gap-2">
      {data.actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || "default"}
          size="sm"
          onClick={() => {
            // Handle action - could dispatch to chat store or parent component
            console.log("Action clicked:", action.action);
          }}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
