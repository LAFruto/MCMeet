"use client";

import { useState } from "react";
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
import { MOCK_USER_ACCOUNTS } from "@/app/(dashboard)/faculty/mock-data";
import { FACULTY_CONSTANTS } from "@/app/(dashboard)/faculty/constants";

// Use centralized mock data
const AVAILABLE_USERS = MOCK_USER_ACCOUNTS;

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
  const [formData, setFormData] = useState({
    position: "",
    phone: "",
    officeHours: {
      start: "",
      end: "",
    },
    availableDays: [] as string[],
  });

  // Filter users based on search
  const filteredUsers = AVAILABLE_USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setFormData((prev) => ({
      ...prev,
      phone: user.phone || "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      onPromote({ userId: selectedUser.id, facultyData: formData });
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
            {filteredUsers.map((user) => (
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
            ))}
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
                placeholder="+1 (555) 123-4567"
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
