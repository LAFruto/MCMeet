import type { Metadata } from "next";
import { Suspense } from "react";
import { getFacultyMembers } from "@/lib/server/faculty-server";
import { FacultyClient } from "./faculty-client";
import { FacultyErrorBoundary } from "./index";
import { FacultyLoadingSkeleton } from "./index";
import { getAdminSession } from "@/lib/authz";

export const metadata: Metadata = {
  title: "Faculty | MCMeet",
  description: "Manage faculty members and user roles",
};

/**
 * Faculty Directory Page
 *
 * Admin-only page for managing faculty members in the system.
 * Provides functionality for viewing, editing, and promoting users to faculty.
 */
export default async function FacultyPage() {
  // Require admin role
  await getAdminSession();

  const faculty = await getFacultyMembers();

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden">
      <FacultyErrorBoundary>
        <Suspense fallback={<FacultyLoadingSkeleton />}>
          <FacultyClient initialData={faculty} />
        </Suspense>
      </FacultyErrorBoundary>
    </main>
  );
}
