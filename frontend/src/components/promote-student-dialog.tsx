"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { UserAccount } from "@/lib/types";
import {
  ArrowUp,
  Building,
  Clock,
  GraduationCap,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useState } from "react";

interface PromoteStudentDialogProps {
  student?: UserAccount;
  onClose: () => void;
  onPromote: (studentId: string, facultyData: any) => void;
}

export function PromoteStudentDialog({
  student,
  onClose,
  onPromote,
}: PromoteStudentDialogProps) {
  const [formData, setFormData] = useState({
    department: student?.department || "",
    phone: student?.phone || "",
    officeHours: "",
    status: "Available" as "Available" | "Busy" | "Away",
  });

  const [selectedStatus, setSelectedStatus] = useState<
    "Available" | "Busy" | "Away"
  >("Available");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (student) {
      onPromote(student.id, formData);
    }
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  if (!student) {
    return (
      <div className="text-center py-8">
        <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          Select a student to promote to faculty
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Student Info Display */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <Label className="text-xs font-medium">Student Account</Label>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium">{student.name}</span>
            <Badge variant="secondary" className="text-xs">
              {student.role}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span>{student.email}</span>
          </div>
          {student.department && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building className="h-3 w-3" />
              <span>{student.department}</span>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Faculty Setup Fields */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <ArrowUp className="h-4 w-4 text-blue-600" />
          <Label className="text-sm font-medium">Faculty Setup</Label>
        </div>

        {/* Department Field */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 w-full sm:w-20">
            <Building className="h-4 w-4 text-muted-foreground" />
            <Label className="text-xs">Department</Label>
          </div>
          <Input
            value={formData.department}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("department", e.target.value)
            }
            className="h-8 text-sm flex-1 w-full"
            placeholder="Computer Science"
            required
          />
        </div>

        {/* Phone Field */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 w-full sm:w-20">
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

        {/* Status Selection */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 w-full sm:w-20">
            <User className="h-4 w-4 text-muted-foreground" />
            <Label className="text-xs">Status</Label>
          </div>
          <div className="flex gap-2 flex-1 w-full">
            <Button
              type="button"
              variant={selectedStatus === "Available" ? "default" : "outline"}
              size="sm"
              className="flex-1 h-8 text-[10px] sm:text-xs"
              onClick={() => {
                setSelectedStatus("Available");
                handleInputChange("status", "Available");
              }}
            >
              Available
            </Button>
            <Button
              type="button"
              variant={selectedStatus === "Busy" ? "default" : "outline"}
              size="sm"
              className="flex-1 h-8 text-[10px] sm:text-xs"
              onClick={() => {
                setSelectedStatus("Busy");
                handleInputChange("status", "Busy");
              }}
            >
              Busy
            </Button>
            <Button
              type="button"
              variant={selectedStatus === "Away" ? "default" : "outline"}
              size="sm"
              className="flex-1 h-8 text-[10px] sm:text-xs"
              onClick={() => {
                setSelectedStatus("Away");
                handleInputChange("status", "Away");
              }}
            >
              Away
            </Button>
          </div>
        </div>

        {/* Office Hours Field */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 w-full sm:w-20">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Label className="text-xs">Office Hours</Label>
          </div>
          <Input
            value={formData.officeHours}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("officeHours", e.target.value)
            }
            className="h-8 text-sm flex-1 w-full"
            placeholder="Mon-Fri 9:00 AM - 5:00 PM"
          />
        </div>
      </div>

      <Separator />

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1 cursor-pointer"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit" size="sm" className="flex-1 cursor-pointer">
          <ArrowUp className="h-4 w-4 mr-2" />
          Promote to Faculty
        </Button>
      </div>
    </form>
  );
}
