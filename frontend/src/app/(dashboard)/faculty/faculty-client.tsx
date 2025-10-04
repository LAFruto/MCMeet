"use client";

import { usePageContext } from "@/lib/hooks/use-chat";
import {
  FacultyDataTable,
  type Faculty as FacultyTableData,
} from "@/components/faculty-data-table";
import type { FacultyMember } from "@/lib/types";

interface FacultyClientProps {
  initialData: FacultyMember[];
}

export function FacultyClient({ initialData }: FacultyClientProps) {
  usePageContext("faculty");

  // Transform faculty data to match data-table format
  const tableData: FacultyTableData[] = initialData.map((member) => ({
    id: member.id,
    name: member.name,
    department: member.department,
    email: member.email,
    phone: member.phone,
    availability: member.status === "Available" ? "available" : "busy",
    officeHours: member.availability,
  }));

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Faculty Directory</h1>
        <p className="text-muted-foreground">
          Browse and connect with faculty members
        </p>
      </div>
      <FacultyDataTable data={tableData} />
    </div>
  );
}
