"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Calendar,
  Clock,
  Mail,
  Phone,
  BookOpen,
  MapPin,
} from "lucide-react";
import { usePageContext } from "@/lib/hooks/use-chat";
import type { FacultyMember } from "@/lib/types";
import { useState } from "react";
import { motion } from "framer-motion";

interface FacultyClientProps {
  initialData: FacultyMember[];
}

export function FacultyClient({ initialData }: FacultyClientProps) {
  usePageContext("faculty");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaculty = searchQuery
    ? initialData.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.specializations.some((s) =>
            s.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : initialData;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, department, or specialization..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredFaculty.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="hover:shadow-xl transition-all hover:scale-[1.02] border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14 border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-bold text-lg">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {member.department}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      member.status === "Available" ? "default" : "secondary"
                    }
                    className={
                      member.status === "Available"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    }
                  >
                    {member.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm group">
                    <Mail className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <a
                      href={`mailto:${member.email}`}
                      className="text-muted-foreground hover:text-primary truncate transition-colors"
                    >
                      {member.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {member.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {member.availability}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground font-medium">
                      Next: {member.nextAvailable}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Specializations</p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.specializations.map((spec, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 group">
                  <BookOpen className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredFaculty.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">
            No faculty members found matching your search.
          </p>
        </motion.div>
      )}
    </>
  );
}
