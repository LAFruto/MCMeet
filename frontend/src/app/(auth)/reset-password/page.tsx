import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password | MCMeet",
  description: "Reset your MCMeet account password",
};

/**
 * Reset Password Page
 *
 * Page for users to reset their account password.
 *
 * @returns {JSX.Element} The reset password page component
 */
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordSkeleton />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="border-0 shadow-md rounded-lg">
          <div className="text-center space-y-2 pb-3 pt-6 px-6">
            <div className="flex justify-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-muted rounded-lg animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="h-8 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <div className="space-y-2 px-4 pb-6 md:px-6 md:pb-8">
            <div className="space-y-3 md:space-y-4">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-9 bg-muted rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-9 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-9 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
