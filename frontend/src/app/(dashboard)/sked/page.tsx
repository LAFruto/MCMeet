import { getUserBookings } from "@/lib/server/booking-server";
import { SkedClient } from "./sked-client";
import { getAdminSession } from "@/lib/authz";

export default async function SkedPage() {
  // Require admin role
  await getAdminSession();

  const meetings = await getUserBookings();

  return (
    <main className="flex-1 flex flex-col h-full">
      <SkedClient meetings={meetings} />
    </main>
  );
}
