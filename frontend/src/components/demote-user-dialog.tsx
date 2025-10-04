"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, User, ArrowDown } from "lucide-react";
import type { Faculty } from "./faculty-data-table";

interface DemoteUserDialogProps {
  faculty: Faculty;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (facultyId: number) => void;
}

export function DemoteUserDialog({
  faculty,
  isOpen,
  onClose,
  onConfirm,
}: DemoteUserDialogProps) {
  const handleConfirm = () => {
    onConfirm(faculty.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <DialogTitle>Demote to User</DialogTitle>
              <DialogDescription>
                This action will remove faculty privileges from this member.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-3">
            {/* Faculty Info Display */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{faculty.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {faculty.position}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {faculty.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Message */}
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <div className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    Warning: This action cannot be undone
                  </div>
                  <div className="text-sm text-orange-700 dark:text-orange-300">
                    This faculty member will lose access to faculty-specific
                    features and will become a regular user. They can be
                    promoted back to faculty later if needed.
                  </div>
                </div>
              </div>
            </div>

            {/* What will happen */}
            <div className="space-y-2">
              <div className="text-sm font-medium">What will happen:</div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ArrowDown className="h-3 w-3 text-orange-500" />
                  Faculty privileges will be removed
                </li>
                <li className="flex items-center gap-2">
                  <ArrowDown className="h-3 w-3 text-orange-500" />
                  Access to faculty management features will be lost
                </li>
                <li className="flex items-center gap-2">
                  <ArrowDown className="h-3 w-3 text-orange-500" />
                  They will appear in the user accounts list instead
                </li>
                <li className="flex items-center gap-2">
                  <ArrowDown className="h-3 w-3 text-orange-500" />
                  All faculty information will be preserved for future promotion
                </li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            className="cursor-pointer"
          >
            <ArrowDown className="h-4 w-4 mr-2" />
            Demote to User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
