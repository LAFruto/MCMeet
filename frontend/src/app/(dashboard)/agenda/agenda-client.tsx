"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePageContext } from "@/lib/hooks/use-chat";
import { CalendarDays, MapPin, Clock, User, MoreHorizontal } from "lucide-react";
import type { Meeting } from "@/lib/types";
import { motion } from "framer-motion";

interface AgendaClientProps {
  meetings: Meeting[];
}

export function AgendaClient({ meetings }: AgendaClientProps) {
  usePageContext("agenda");

  const scheduledMeetings = meetings.filter((m) => m.status === "scheduled");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <CalendarDays className="h-5 w-5 text-primary" />
            Upcoming Schedule
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {scheduledMeetings.length} {scheduledMeetings.length === 1 ? 'meeting' : 'meetings'} scheduled
          </p>
        </CardHeader>
        <CardContent>
          {scheduledMeetings.length > 0 ? (
            <div className="space-y-3">
              {scheduledMeetings.map((meeting, index) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="border-border/50 hover:shadow-md transition-all hover:scale-[1.01]">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-base mb-1">{meeting.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-3.5 w-3.5" />
                            <span>{meeting.facultyName}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid gap-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">{meeting.date}</span>
                          <Badge variant="outline" className="ml-auto text-xs">
                            {meeting.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {meeting.startTime} - {meeting.endTime}
                          </span>
                        </div>
                        {meeting.location && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">{meeting.location}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <CalendarDays className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium mb-1">
                No scheduled meetings
              </p>
              <p className="text-sm text-muted-foreground">
                Use the chat to book appointments with faculty!
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
