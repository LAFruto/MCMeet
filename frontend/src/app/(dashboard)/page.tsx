import { ChatInterface } from "./chat-interface";

/**
 * Home Page (Dashboard)
 *
 * Main landing page featuring the AI chat interface for student-faculty interactions.
 * Primary hub for booking meetings, checking availability, and getting information.
 *
 * @returns {JSX.Element} The home page component
 */
export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <ChatInterface />
    </main>
  );
}
