/**
 * Faculty directory types and interfaces
 */

export interface FacultyTableData {
  id: number;
  name: string;
  position: string;
  email: string;
  phone?: string;
  availability: "available" | "busy" | "away";
  officeHours?: {
    start: string;
    end: string;
  };
  availableDays?: string[];
}

export interface FacultyUpdateData {
  name?: string;
  position?: string;
  phone?: string;
  officeHours?: {
    start: string;
    end: string;
  };
  availableDays?: string[];
}

export interface FacultyPromotionData {
  userId: string;
  facultyData: FacultyUpdateData;
}

export interface FacultySearchFilters {
  searchTerm: string;
  status?: "available" | "busy" | "away";
}

export interface FacultyClientState {
  isPromoteDialogOpen: boolean;
  searchTerm: string;
  facultyData: any[]; // Will be properly typed when we get the server types
}
