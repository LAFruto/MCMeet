import type { Metadata } from "next";
import SettingsClient from "./settings-client";

export const metadata: Metadata = {
  title: "Settings | MCMeet",
  description: "Manage your account settings and preferences",
};

/**
 * Settings Page
 *
 * User settings page for managing account preferences, profile information,
 * and system settings.
 *
 * @returns {JSX.Element} The settings page component
 */
export default function SettingsPage() {
  return <SettingsClient />;
}
