import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client instance configured for the application
 * Handles authentication operations on the client side
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

/**
 * Authentication helper functions and hooks
 * @property {Function} signIn - Signs in a user with credentials
 * @property {Function} signUp - Creates a new user account
 * @property {Function} signOut - Signs out the current user
 * @property {Function} useSession - React hook to access current session
 */
export const { signIn, signUp, signOut, useSession } = authClient;
