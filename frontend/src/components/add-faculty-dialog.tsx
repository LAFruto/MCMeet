"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Building, Clock, Mail, Phone, Save, User } from "lucide-react";
import { useState } from "react";

interface AddFacultyDialogProps {
  onClose: () => void;
}

export function AddFacultyDialog({ onClose }: AddFacultyDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    officeHours: "",
    status: "Available" as "Available" | "Busy" | "Away",
  });

  const [selectedStatus, setSelectedStatus] = useState<
    "Available" | "Busy" | "Away"
  >("Available");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement faculty creation logic
    console.log("Adding faculty:", formData);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        {/* Name Field */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 w-full sm:w-20">
            <User className="h-4 w-4 text-muted-foreground" />
            <Label className="text-xs">Name</Label>
          </div>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="h-8 text-sm flex-1 w-full"
            placeholder="Full name"
            required
          />
        </div>

        {/* Email Field */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 w-full sm:w-20">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <Label className="text-xs">Email</Label>
          </div>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="h-8 text-sm flex-1 w-full"
            placeholder="faculty@university.edu"
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
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="h-8 text-sm flex-1 w-full"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        {/* Department Field */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 w-full sm:w-20">
            <Building className="h-4 w-4 text-muted-foreground" />
            <Label className="text-xs">Department</Label>
          </div>
          <Input
            value={formData.department}
            onChange={(e) => handleInputChange("department", e.target.value)}
            className="h-8 text-sm flex-1 w-full"
            placeholder="Computer Science"
            required
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
            onChange={(e) => handleInputChange("officeHours", e.target.value)}
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
          <Save className="h-4 w-4 mr-2" />
          Add Faculty
        </Button>
      </div>
    </form>
  );
}
