/**
 * Consolidated loading skeleton components
 */

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Generic loading skeleton for dashboard pages
 */
export function DashboardLoadingSkeleton() {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Header skeleton */}
      <div className="shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 sm:px-6 h-14 border-b">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4 space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for calendar/agenda views
 */
export function CalendarLoadingSkeleton() {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Header skeleton */}
      <div className="shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 h-14 border-b">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>

        {/* Navigation bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 h-12">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>

        {/* Schedule type tabs */}
        <div className="flex items-center gap-2 px-4 sm:px-6 h-12">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>

      {/* Calendar content skeleton */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Time column */}
          <div className="w-16 border-r">
            <div className="h-12 border-b" />
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-12 border-b border-dashed border-muted"
              />
            ))}
          </div>

          {/* Calendar grid */}
          <div className="flex-1">
            {/* Header row */}
            <div className="h-12 border-b flex">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex-1 border-r border-muted">
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>

            {/* Calendar rows */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-12 border-b border-dashed border-muted flex"
              >
                {Array.from({ length: 7 }).map((_, j) => (
                  <div
                    key={j}
                    className="flex-1 border-r border-dashed border-muted"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for table views (faculty directory, etc.)
 */
export function TableLoadingSkeleton() {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Header skeleton */}
      <div className="shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 sm:px-6 h-14 border-b">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="flex items-center justify-between px-4 sm:px-6 h-12">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4 space-y-4">
          {/* Table header */}
          <div className="flex items-center space-x-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Table rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 py-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Event/meeting cell skeleton
 */
export function EventCellSkeleton() {
  return (
    <div className="absolute inset-1 p-1">
      <div className="h-full bg-muted/30 rounded-sm animate-pulse">
        <div className="p-2 space-y-1">
          <Skeleton className="h-3 w-full" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Meeting cell skeleton with more detail
 */
export function MeetingCellSkeleton() {
  return (
    <div className="absolute inset-0 p-1">
      <div className="h-full bg-muted/50 rounded border border-muted animate-pulse">
        <div className="p-2 space-y-1">
          <Skeleton className="h-3 w-full" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}
