"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePageContext } from "@/lib/hooks/use-chat";
import { MEETING_STATUS_CONFIG } from "@/lib/constants/meeting-data";
import { Calendar, Clock, Users } from "lucide-react";
import type { Meeting } from "@/lib/types";
import { motion } from "framer-motion";

interface SkedClientProps {
  meetings: Meeting[];
}

export function SkedClient({ meetings }: SkedClientProps) {
  usePageContext("sked");

  const upcomingMeetings = meetings.slice(0, 5);
  const todayCount = meetings.filter((m) => m.status === "scheduled").length;
  const weekCount = meetings.length;
  const facultyCount = new Set(meetings.map((m) => m.facultyId)).size;

  const stats = [
    {
      title: "Today's Meetings",
      value: todayCount,
      description: todayCount > 0 ? "Scheduled for today" : "No meetings today",
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "This Week",
      value: weekCount,
      description: "Total meetings",
      icon: Clock,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Faculty Members",
      value: facultyCount,
      description: "Different faculty",
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="border-border/50 hover:shadow-lg transition-all hover:scale-[1.02]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.bgColor} p-2 rounded-lg`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8"
      >
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-xl">Upcoming Meetings</CardTitle>
            <p className="text-sm text-muted-foreground">
              Your next {upcomingMeetings.length} scheduled appointments
            </p>
          </CardHeader>
          <CardContent>
            {upcomingMeetings.length > 0 ? (
              <div className="space-y-3">
                {upcomingMeetings.map((meeting, index) => {
                  const statusConfig = MEETING_STATUS_CONFIG[meeting.status];
                  return (
                    <motion.div
                      key={meeting.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-start gap-4 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center justify-center mt-1">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${statusConfig.color} animate-pulse`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {meeting.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {meeting.facultyName}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {meeting.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {meeting.startTime} - {meeting.endTime}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium mb-1">
                  No upcoming meetings
                </p>
                <p className="text-sm text-muted-foreground">
                  Book your first appointment through the chat
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
