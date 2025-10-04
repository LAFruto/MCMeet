/**
 * Validation schemas for faculty directory
 */

import { z } from "zod";

/**
 * Schema for faculty update data validation
 */
export const facultyUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  position: z
    .string()
    .min(1, "Position is required")
    .max(100, "Position too long"),
  phone: z.string().optional().or(z.literal("")),
  officeHours: z
    .object({
      start: z.string().min(1, "Start time is required"),
      end: z.string().min(1, "End time is required"),
    })
    .optional(),
  availableDays: z.array(z.string()).optional(),
});

/**
 * Schema for faculty promotion data validation
 */
export const facultyPromotionSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  facultyData: facultyUpdateSchema,
});

/**
 * Schema for search filters validation
 */
export const searchFiltersSchema = z.object({
  searchTerm: z.string().max(100, "Search term too long"),
  status: z.enum(["available", "busy", "away"]).optional(),
});

/**
 * Type inference from schemas
 */
export type FacultyUpdateInput = z.infer<typeof facultyUpdateSchema>;
export type FacultyPromotionInput = z.infer<typeof facultyPromotionSchema>;
export type SearchFiltersInput = z.infer<typeof searchFiltersSchema>;
