"use client";

/**
 * Custom hooks for faculty directory
 */

import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import type { FacultyTableData, FacultyUpdateData } from "./types";
import type { FacultyMember } from "@/lib/types";
import { FACULTY_MESSAGES } from "./constants";

/**
 * Hook for managing faculty data and operations
 */
export function useFacultyData(initialData: any[]) {
  const [facultyData, setFacultyData] = useState(initialData);

  /**
   * Transform faculty data to match table format
   */
  const tableData = useMemo((): FacultyTableData[] => {
    return facultyData.map((member: FacultyMember) => ({
      id: member.id,
      name: member.name,
      position: member.department || "Not specified",
      email: member.email,
      phone: member.phone,
      availability: member.status === "Available" ? "available" : "busy",
      officeHours: {
        start: "9:00 AM",
        end: "5:00 PM",
      },
      availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    }));
  }, [facultyData]);

  /**
   * Handle faculty updates with optimistic updates
   */
  const handleFacultyUpdate = useCallback(
    (facultyId: number, updatedData: FacultyUpdateData) => {
      setFacultyData((prev: FacultyMember[]) =>
        prev.map((faculty: FacultyMember) =>
          faculty.id === facultyId
            ? {
                ...faculty,
                name: updatedData.name ?? faculty.name,
                department: updatedData.position ?? faculty.department,
                phone: updatedData.phone ?? faculty.phone,
              }
            : faculty
        )
      );

      toast.success(FACULTY_MESSAGES.UPDATE_SUCCESS);
    },
    []
  );

  /**
   * Handle faculty demotion with confirmation
   */
  const handleFacultyDemote = useCallback((facultyId: number) => {
    setFacultyData((prev: FacultyMember[]) =>
      prev.filter((faculty: FacultyMember) => faculty.id !== facultyId)
    );
    toast.success(FACULTY_MESSAGES.DEMOTE_SUCCESS);
  }, []);

  /**
   * Handle faculty promotion
   */
  const handleFacultyPromote = useCallback(
    (userId: string, facultyData: FacultyUpdateData) => {
      // TODO: Implement actual promotion logic with server call
      console.log("Promoting user:", userId, facultyData);
      toast.success(FACULTY_MESSAGES.PROMOTE_SUCCESS);
    },
    []
  );

  return {
    facultyData,
    tableData,
    handleFacultyUpdate,
    handleFacultyDemote,
    handleFacultyPromote,
  };
}

/**
 * Hook for managing search and filtering
 */
export function useFacultySearch() {
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Filter faculty data based on search term
   */
  const filterFaculty = useCallback(
    (data: FacultyTableData[]) => {
      if (!searchTerm.trim()) return data;

      const term = searchTerm.toLowerCase();
      return data.filter(
        (faculty) =>
          faculty.name.toLowerCase().includes(term) ||
          faculty.position.toLowerCase().includes(term) ||
          faculty.email.toLowerCase().includes(term)
      );
    },
    [searchTerm]
  );

  return {
    searchTerm,
    setSearchTerm,
    filterFaculty,
  };
}
