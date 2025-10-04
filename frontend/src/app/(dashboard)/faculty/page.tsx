import { getFacultyMembers } from "@/lib/server/faculty-server";
import { FacultyClient } from "./faculty-client";
import { getAdminSession } from "@/lib/authz";

export default async function FacultyPage() {
  // Require admin role
  await getAdminSession();

  const faculty = await getFacultyMembers();

  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Faculty Directory
          </h1>
          <p className="text-muted-foreground">
            Browse and book appointments with faculty members
          </p>
        </div>

        <FacultyClient initialData={faculty} />
      </div>
    </main>
  );
}
