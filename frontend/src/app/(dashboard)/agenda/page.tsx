import { getUserBookings } from "@/lib/server/booking-server";
import { AgendaClient } from "./agenda-client";

export default async function AgendaPage() {
  const meetings = await getUserBookings();

  return (
    <main className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            My Agenda
          </h1>
          <p className="text-muted-foreground">
            Your schedule at a glance. Use the chat for detailed actions.
          </p>
        </div>

        <AgendaClient meetings={meetings} />
      </div>
    </main>
  );
}
