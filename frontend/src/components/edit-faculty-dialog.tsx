"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Mail, Phone, Clock, Calendar, Save, X } from "lucide-react";
import type { FacultyTableData } from "@/app/(dashboard)/faculty/types";
import { FACULTY_CONSTANTS } from "@/app/(dashboard)/faculty/constants";

interface EditFacultyDialogProps {
  faculty: FacultyTableData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (facultyId: string, updatedData: Partial<FacultyTableData>) => void;
}

export function EditFacultyDialog({
  faculty,
  isOpen,
  onClose,
  onSave,
}: EditFacultyDialogProps) {
  const [formData, setFormData] = useState({
    name: faculty.name,
    position: faculty.position,
    phone: faculty.phone || "",
    officeHours: {
      start: faculty.officeHours?.start || "",
      end: faculty.officeHours?.end || "",
    },
    availableDays: faculty.availableDays || [],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleTimeChange = (timeType: "start" | "end", value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      officeHours: {
        ...prev.officeHours,
        [timeType]: value,
      },
    }));
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev: any) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d: string) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData: Partial<FacultyTableData> = {
      name: formData.name,
      position: formData.position,
      phone: formData.phone,
      officeHours: formData.officeHours,
      availableDays: formData.availableDays,
    };
    onSave(faculty.id, updatedData);
    onClose();
  };

  const DAYS = FACULTY_CONSTANTS.DAYS_OF_WEEK;
  const TIME_SLOTS = FACULTY_CONSTANTS.TIME_SLOTS;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Faculty Details</DialogTitle>
          <DialogDescription>
            Update the faculty member's information and availability.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Faculty Info Section */}
          <div className="space-y-3">
            {/* Name Field */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 w-full sm:w-24">
                <User className="h-4 w-4 text-muted-foreground" />
                <Label className="text-xs">Name</Label>
              </div>
              <Input
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("name", e.target.value)
                }
                className="h-8 text-sm flex-1 w-full"
                placeholder="Faculty name"
                required
              />
            </div>

            {/* Position Field */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 w-full sm:w-24">
                <User className="h-4 w-4 text-muted-foreground" />
                <Label className="text-xs">Position</Label>
              </div>
              <Input
                value={formData.position}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("position", e.target.value)
                }
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("phone", e.target.value)
                }
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
                value={faculty.email}
                className="h-8 text-sm flex-1 w-full bg-muted"
                disabled
              />
            </div>
          </div>

          <Separator />

          {/* Availability Section */}
          <div className="space-y-3">
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
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="cursor-pointer"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" size="sm" className="flex-1 cursor-pointer">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
