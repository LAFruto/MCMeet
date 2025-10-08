import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login | MCMeet",
  description: "Sign in to your MCMeet account",
};

/**
 * Login Page
 *
 * Authentication page for users to sign in to their accounts.
 *
 * @returns {JSX.Element} The login page component
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
