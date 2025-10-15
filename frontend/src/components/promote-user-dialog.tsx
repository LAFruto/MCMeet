"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  User as UserIcon,
  Mail,
  Phone,
  Clock,
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Calendar,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User } from "@/lib/types";
import { FACULTY_CONSTANTS } from "@/app/(dashboard)/faculty/constants";
import { Textarea } from "@/components/ui/textarea";

interface PromoteUserDialogProps {
  onClose: () => void;
  onPromote: (promotionData: { userId: string; facultyData: any }) => void;
}

export function PromoteUserDialog({
  onClose,
  onPromote,
}: PromoteUserDialogProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    position: "",
    phone: "",
    department: "",
    specializations: [] as string[],
    specializationsInput: "",
    officeHours: {
      start: "09:00",
      end: "17:00",
    },
    availableDays: [] as string[],
  });

  // Fetch students on mount
  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await fetch("/api/users/students");
        if (response.ok) {
          const students = await response.json();
          setAvailableUsers(students);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStudents();
  }, []);

  // Filter users based on search
  const filteredUsers = availableUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setFormData((prev) => ({
      ...prev,
      phone: user.phone || "",
      department:
        user.department ||
        "CCIS - College of Computing and Information Sciences",
    }));
  };

  const handleNext = () => {
    if (selectedUser) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      // Parse specializations from comma-separated input
      const specializations = formData.specializationsInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const response = await fetch(`/api/users/${selectedUser.id}/promote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          position: formData.position,
          phone: formData.phone,
          department: formData.department,
          specializations,
          officeHours: formData.officeHours,
          availableDays: formData.availableDays,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to promote user");
      }

      // Success! Call the parent callback and refresh
      onPromote({ userId: selectedUser.id, facultyData: formData });
      window.location.reload();
    } catch (error: any) {
      alert(`Failed to promote user: ${error.message}`);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTimeChange = (timeType: "start" | "end", value: string) => {
    setFormData((prev) => ({
      ...prev,
      officeHours: {
        ...prev.officeHours,
        [timeType]: value,
      },
    }));
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const DAYS = FACULTY_CONSTANTS.DAYS_OF_WEEK;
  const TIME_SLOTS = FACULTY_CONSTANTS.TIME_SLOTS;

  return (
    <div className="space-y-4">
      {/* Step 1: User Selection */}
      {currentStep === 1 && (
        <div className="">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-none pl-9 h-9"
            />
          </div>

          {/* User List */}
          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-sm text-muted-foreground">
                  Loading students...
                </div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-sm text-muted-foreground">
                  {searchTerm
                    ? "No students found"
                    : "No students available to promote"}
                </div>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-3 p-2 border-b cursor-pointer transition-colors ${
                    selectedUser?.id === user.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => handleUserSelect(user)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-sm">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{user.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </div>
                    {user.department && (
                      <div className="text-xs text-muted-foreground">
                        {user.department}
                      </div>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    User
                  </Badge>
                </div>
              ))
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 p-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleNext}
              disabled={!selectedUser}
              className="cursor-pointer"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Faculty Details */}
      {currentStep === 2 && selectedUser && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selected User Display */}
          <div className="bg-muted/50 p-4 space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {selectedUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium text-sm">{selectedUser.name}</div>
                <div className="text-xs text-muted-foreground">
                  {selectedUser.email}
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                Selected User
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Faculty Setup Fields */}
          <div className="space-y-3 px-4">
            {/* Position Field */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 w-full sm:w-24">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <Label className="text-xs">Position</Label>
              </div>
              <Input
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                className="h-8 text-sm flex-1 w-full"
                placeholder="Assistant Professor"
                required
              />
            </div>

            {/* Department Field */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 w-full sm:w-24">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <Label className="text-xs">Department</Label>
              </div>
              <Input
                value={formData.department}
                onChange={(e) =>
                  handleInputChange("department", e.target.value)
                }
                className="h-8 text-sm flex-1 w-full"
                placeholder="CCIS - College of Computing and Information Sciences"
              />
            </div>

            {/* Phone Field */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 w-full sm:w-24">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Label className="text-xs">Phone</Label>
              </div>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="h-8 text-sm flex-1 w-full"
                placeholder="+63 99 123 4567"
              />
            </div>

            {/* Specializations Field */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 w-full sm:w-24">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <Label className="text-xs">Specializations</Label>
              </div>
              <Textarea
                value={formData.specializationsInput}
                onChange={(e) =>
                  handleInputChange("specializationsInput", e.target.value)
                }
                className="text-sm flex-1 w-full min-h-[60px]"
                placeholder="Machine Learning, Data Science, AI (comma separated)"
              />
            </div>

            {/* Email Field (Read-only) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 w-full sm:w-24">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Label className="text-xs">Email</Label>
              </div>
              <Input
                value={selectedUser.email}
                className="h-8 text-sm flex-1 w-full bg-muted"
                disabled
              />
            </div>

            {/* Office Hours Field */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 w-full sm:w-24">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Label className="text-xs">Office Hours</Label>
              </div>
              <div className="flex gap-2 flex-1 w-full">
                <Select
                  value={formData.officeHours.start}
                  onValueChange={(value) => handleTimeChange("start", value)}
                >
                  <SelectTrigger className="h-8 text-sm flex-1">
                    <SelectValue placeholder="Start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground text-sm self-center">
                  to
                </span>
                <Select
                  value={formData.officeHours.end}
                  onValueChange={(value) => handleTimeChange("end", value)}
                >
                  <SelectTrigger className="h-8 text-sm flex-1">
                    <SelectValue placeholder="End time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Available Days Field */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 w-full sm:w-24">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Label className="text-xs">Available Days</Label>
              </div>
              <div className="flex flex-wrap gap-1 flex-1 w-full">
                {DAYS.map((day) => (
                  <Button
                    key={day}
                    type="button"
                    variant={
                      formData.availableDays.includes(day)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => handleDayToggle(day)}
                  >
                    {day.slice(0, 3)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <Separator />

          {/* Actions */}
          <div className="flex gap-2 px-4 pb-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="flex-1 cursor-pointer">
              <GraduationCap className="h-4 w-4 mr-2" />
              Promote to Faculty
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
