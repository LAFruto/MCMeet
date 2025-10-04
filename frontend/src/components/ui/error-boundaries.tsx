/**
 * Consolidated error boundary components
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  RefreshCw,
  Calendar,
  Users,
} from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
  context?: string;
}

/**
 * Generic error boundary for dashboard pages
 */
export class DashboardErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `${this.props.context || "Dashboard"} error:`,
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error!}
            reset={() => this.setState({ hasError: false, error: undefined })}
          />
        );
      }

      return (
        <div className="flex flex-col h-full w-full overflow-hidden">
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-4 max-w-md">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                  <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold">
                  {this.props.context
                    ? `${this.props.context} Error`
                    : "Something went wrong"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  We encountered an error while loading this page. Please try
                  refreshing.
                </p>
              </div>

              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Page
                </Button>
                <Button
                  onClick={() =>
                    this.setState({ hasError: false, error: undefined })
                  }
                  className="cursor-pointer"
                >
                  Try Again
                </Button>
              </div>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="text-left">
                  <summary className="text-sm font-medium cursor-pointer">
                    Error Details (Development)
                  </summary>
                  <pre className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Error boundary specifically for calendar/agenda views
 */
export class CalendarErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Calendar error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col h-full w-full overflow-hidden">
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-4 max-w-md">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                  <Calendar className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Calendar Error</h2>
                <p className="text-sm text-muted-foreground">
                  We encountered an error while loading the calendar. This might
                  be due to a data formatting issue or network problem.
                </p>
              </div>

              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Page
                </Button>
                <Button
                  onClick={() =>
                    this.setState({ hasError: false, error: undefined })
                  }
                  className="cursor-pointer"
                >
                  Try Again
                </Button>
              </div>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="text-left">
                  <summary className="text-sm font-medium cursor-pointer">
                    Error Details (Development)
                  </summary>
                  <pre className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Error boundary specifically for faculty directory
 */
export class FacultyErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Faculty directory error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col h-full w-full overflow-hidden">
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-4 max-w-md">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                  <Users className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold">
                  Faculty Directory Error
                </h2>
                <p className="text-sm text-muted-foreground">
                  We encountered an error while loading the faculty directory.
                  Please try refreshing the page.
                </p>
              </div>

              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Page
                </Button>
                <Button
                  onClick={() =>
                    this.setState({ hasError: false, error: undefined })
                  }
                  className="cursor-pointer"
                >
                  Try Again
                </Button>
              </div>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="text-left">
                  <summary className="text-sm font-medium cursor-pointer">
                    Error Details (Development)
                  </summary>
                  <pre className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Generic error fallback component
 */
export function ErrorFallback({
  error,
  reset,
  context = "Page",
}: {
  error: Error;
  reset: () => void;
  context?: string;
}) {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-md">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
              <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">{context} Issue</h2>
            <p className="text-sm text-muted-foreground">
              There was a problem loading this section. This might be temporary.
            </p>
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              onClick={reset}
              className="cursor-pointer"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload {context}
            </Button>
          </div>

          {process.env.NODE_ENV === "development" && (
            <details className="text-left">
              <summary className="text-sm font-medium cursor-pointer">
                Error Details (Development)
              </summary>
              <pre className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}