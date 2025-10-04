/**
 * Faculty directory exports
 */

export { FacultyClient } from "./faculty-client";
export { FacultyErrorBoundary } from "@/components/ui/error-boundaries";
export { TableLoadingSkeleton as FacultyLoadingSkeleton } from "@/components/ui/loading-skeletons";
export { MOCK_USER_ACCOUNTS } from "./mock-data";
export { FACULTY_CONSTANTS, FACULTY_MESSAGES } from "./constants";
export { useFacultyData, useFacultySearch } from "./hooks";
export type {
  FacultyTableData,
  FacultyUpdateData,
  FacultyPromotionData,
  FacultySearchFilters,
  FacultyClientState,
} from "./types";
export {
  facultyUpdateSchema,
  facultyPromotionSchema,
  searchFiltersSchema,
} from "./validation";
