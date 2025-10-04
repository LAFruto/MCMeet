"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { BookingRequest } from "@/app/(dashboard)/agenda/types";
import { AGENDA_LABELS } from "@/app/(dashboard)/agenda/constants";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Clock,
  MapPin,
  Mail,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
} from "lucide-react";

interface BookingRequestDetailsDialogProps {
  request: BookingRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string, reason?: string) => void;
  showActions?: boolean;
}

/**
 * Booking Request Details Dialog
 *
 * Displays detailed information about a booking request in a compact modal dialog.
 * Uses proper Shadcn components for better UX and no scrolling required.
 */
export function BookingRequestDetailsDialog({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject,
  showActions = true,
}: BookingRequestDetailsDialogProps) {
  if (!request) return null;

  const getStatusBadge = (status: BookingRequest["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="default"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="destructive"
            className="bg-red-50 text-red-700 border-red-200"
          >
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-600 border-gray-200"
          >
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const handleApprove = () => {
    onApprove?.(request.id);
    onClose();
  };

  const handleReject = () => {
    onReject?.(request.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl font-semibold">
                {request.title}
              </DialogTitle>
              <DialogDescription>
                {request.description || request.purpose}
              </DialogDescription>
            </div>
            {getStatusBadge(request.status)}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Meeting Details - Compact Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Date</span>
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {formatDateTime(request.startTime)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Time</span>
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {formatTime(request.startTime)} - {formatTime(request.endTime)}
              </p>
            </div>

            {request.location && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Location</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {request.location}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Purpose</span>
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {request.purpose}
              </p>
            </div>
          </div>

          <Separator />

          {/* Student Information - Compact */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Student Information
            </h4>
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{request.studentName}</span>
              <span className="text-muted-foreground">•</span>
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {request.studentEmail}
              </span>
            </div>
          </div>

          <Separator />

          {/* Request Timeline - Compact */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Timeline
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="font-medium">
                  {AGENDA_LABELS.REQUESTED_ON}:
                </span>
                <span className="text-muted-foreground">
                  {formatDateTime(request.requestedAt)}
                </span>
              </div>

              {request.approvedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="font-medium">
                    {AGENDA_LABELS.APPROVED_ON}:
                  </span>
                  <span className="text-muted-foreground">
                    {formatDateTime(request.approvedAt)}
                  </span>
                </div>
              )}

              {request.rejectedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="font-medium">
                    {AGENDA_LABELS.REJECTED_ON}:
                  </span>
                  <span className="text-muted-foreground">
                    {formatDateTime(request.rejectedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Rejection Reason - Only if exists */}
          {request.rejectionReason && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Rejection Reason
                </h4>
                <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                  <p className="text-sm text-destructive">
                    {request.rejectionReason}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        {showActions && request.status === "pending" && (
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="cursor-pointer"
            >
              Close
            </Button>
            <Button
              variant="outline"
              onClick={handleReject}
              className="cursor-pointer"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button onClick={handleApprove} className="cursor-pointer">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        )}

        {!showActions && (
          <DialogFooter className="flex justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="cursor-pointer"
            >
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
