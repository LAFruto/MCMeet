import { getAdminSession } from "@/lib/authz";

/**
 * Admin-only faculty management page
 * For adding, editing, and removing faculty members
 */
export default async function FacultyManagementPage() {
  const session = await getAdminSession();

  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Faculty Management
          </h1>
          <p className="text-muted-foreground">
            Add, edit, and manage faculty members
          </p>
        </div>

        <div className="bg-muted/30 border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-2">
            Welcome, {session.user.name}!
          </p>
          <p className="text-sm text-muted-foreground">
            Faculty management interface coming soon...
          </p>
        </div>
      </div>
    </main>
  );
}

