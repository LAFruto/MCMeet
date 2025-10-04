"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Eye,
} from "lucide-react";
import { useState } from "react";

interface BookingRequestCardProps {
  request: BookingRequest;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string, reason?: string) => void;
  onViewDetails: (request: BookingRequest) => void;
  showActions?: boolean;
  className?: string;
}

/**
 * Booking Request Card Component
 *
 * Displays a booking request with appropriate actions based on user role and status.
 * Provides approve/reject functionality for faculty and admin users.
 */
export function BookingRequestCard({
  request,
  onApprove,
  onReject,
  onViewDetails,
  showActions = true,
  className,
}: BookingRequestCardProps) {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const getStatusBadge = (status: BookingRequest["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="default"
            className="bg-green-50 text-green-700 border-green-200 text-xs"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="destructive"
            className="bg-red-50 text-red-700 border-red-200 text-xs"
          >
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-600 border-gray-200 text-xs"
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

  const handleReject = () => {
    onReject(request.id, rejectionReason || undefined);
    setRejectionReason("");
    setIsRejectDialogOpen(false);
  };

  return (
    <Card
      className={cn(
        "w-full hover:shadow-sm transition-shadow cursor-pointer",
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0 flex-1">
            <CardTitle className="text-sm font-semibold line-clamp-1">
              {request.title}
            </CardTitle>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {request.description || request.purpose}
            </p>
          </div>
          <div className="flex-shrink-0">{getStatusBadge(request.status)}</div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Date and Time - Compact */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDateTime(request.startTime)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>
              {formatTime(request.startTime)} - {formatTime(request.endTime)}
            </span>
          </div>
          {request.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">{request.location}</span>
            </div>
          )}
        </div>

        {/* Student Information - Compact */}
        <div className="flex items-center gap-2 text-xs">
          <User className="w-3 h-3 text-muted-foreground" />
          <span className="font-medium">{request.studentName}</span>
          <span className="text-muted-foreground">•</span>
          <Mail className="w-3 h-3 text-muted-foreground" />
          <span className="text-muted-foreground line-clamp-1">
            {request.studentEmail}
          </span>
        </div>

        {/* Request Details - Compact */}
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">{AGENDA_LABELS.REQUESTED_ON}:</span>{" "}
          {formatDateTime(request.requestedAt)}
          {request.approvedAt && (
            <>
              {" • "}
              <span className="font-medium">
                {AGENDA_LABELS.APPROVED_ON}:
              </span>{" "}
              {formatDateTime(request.approvedAt)}
            </>
          )}
          {request.rejectedAt && (
            <>
              {" • "}
              <span className="font-medium">
                {AGENDA_LABELS.REJECTED_ON}:
              </span>{" "}
              {formatDateTime(request.rejectedAt)}
            </>
          )}
        </div>

        {/* Rejection Reason - Compact */}
        {request.rejectionReason && (
          <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-xs">
            <span className="font-medium text-destructive">
              Rejection Reason:
            </span>{" "}
            <span className="text-destructive">{request.rejectionReason}</span>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-1 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(request)}
              className="flex-1 h-7 text-xs cursor-pointer"
            >
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>

            {request.status === "pending" && (
              <>
                <Button
                  size="sm"
                  onClick={() => onApprove(request.id)}
                  className="flex-1 h-7 text-xs cursor-pointer"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Approve
                </Button>

                <Dialog
                  open={isRejectDialogOpen}
                  onOpenChange={setIsRejectDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-7 text-xs cursor-pointer"
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Reject Request</DialogTitle>
                      <DialogDescription>
                        Provide a reason for rejecting this booking request.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="rejection-reason">
                          Reason (Optional)
                        </Label>
                        <Textarea
                          id="rejection-reason"
                          placeholder="Enter reason for rejection..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <DialogFooter className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setIsRejectDialogOpen(false)}
                        className="cursor-pointer"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleReject}
                        className="cursor-pointer"
                      >
                        Reject
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
