"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Clock, Mail, MoreHorizontal, Phone } from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { DemoteUserDialog } from "./demote-user-dialog";
import { EditFacultyDialog } from "./edit-faculty-dialog";

import type { FacultyTableData } from "@/app/(dashboard)/faculty/types";

/**
 * Creates table columns configuration for faculty data table
 *
 * @param setEditingFaculty - Function to set the faculty being edited
 * @param setIsEditDialogOpen - Function to control edit dialog visibility
 * @param setDemotingFaculty - Function to set the faculty being demoted
 * @param setIsDemoteDialogOpen - Function to control demote dialog visibility
 * @returns Array of column definitions for the table
 */
export const createColumns = (
  setEditingFaculty: (faculty: FacultyTableData) => void,
  setIsEditDialogOpen: (open: boolean) => void,
  setDemotingFaculty: (faculty: FacultyTableData) => void,
  setIsDemoteDialogOpen: (open: boolean) => void
): ColumnDef<FacultyTableData>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent px-0"
        >
          Faculty Member
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const faculty = row.original;
      const name = faculty.name;
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-xs text-muted-foreground">
              {row.original.position}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Contact",
    cell: ({ row }) => {
      const faculty = row.original;
      const email = faculty.email;
      const phone = faculty.phone;

      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="truncate">{email}</span>
          </div>
          {phone && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{phone}</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "officeHours",
    header: "Office Hours",
    cell: ({ row }) => {
      const officeHours = row.getValue("officeHours") as
        | { start: string; end: string }
        | undefined;
      return (
        <div className="text-sm">
          {officeHours ? (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span>
                {officeHours.start} - {officeHours.end}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">Not set</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "availableDays",
    header: "Available Days",
    cell: ({ row }) => {
      const availableDays = row.getValue("availableDays") as
        | string[]
        | undefined;
      return (
        <div className="flex flex-wrap gap-1">
          {availableDays && availableDays.length > 0 ? (
            availableDays.map((day) => (
              <Badge key={day} variant="outline" className="text-xs">
                {day.slice(0, 3)}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground text-xs">Not set</span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const faculty = row.original;

      const handleEditDetails = () => {
        setEditingFaculty(faculty);
        setIsEditDialogOpen(true);
      };

      const handleCopyEmail = () => {
        navigator.clipboard.writeText(faculty.email);
        // TODO: Show toast notification
      };

      const handleViewSchedule = () => {
        console.log("View schedule for faculty:", faculty.id);
        // TODO: Navigate to schedule view
      };

      const handleDemoteToUser = () => {
        setDemotingFaculty(faculty);
        setIsDemoteDialogOpen(true);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={handleCopyEmail}
              className="cursor-pointer"
            >
              Copy email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleEditDetails}
              className="cursor-pointer"
            >
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleViewSchedule}
              className="cursor-pointer"
            >
              View Schedule
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDemoteToUser}
              className="cursor-pointer text-orange-600"
            >
              Demote to User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface FacultyDataTableProps {
  data: FacultyTableData[];
  onFacultyUpdate?: (
    facultyId: string,
    updatedData: Partial<FacultyTableData>
  ) => void;
  onFacultyDemote?: (facultyId: string) => void;
}

/**
 * Faculty Data Table Component
 *
 * Displays faculty members in a sortable, filterable table with actions.
 * Provides functionality for editing, viewing schedules, and demoting faculty.
 *
 * @param data - Array of faculty members to display
 * @param onFacultyUpdate - Callback for when faculty details are updated
 * @param onFacultyDemote - Callback for when faculty member is demoted
 */
export function FacultyDataTable({
  data,
  onFacultyUpdate,
  onFacultyDemote,
}: FacultyDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [editingFaculty, setEditingFaculty] =
    React.useState<FacultyTableData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [demotingFaculty, setDemotingFaculty] =
    React.useState<FacultyTableData | null>(null);
  const [isDemoteDialogOpen, setIsDemoteDialogOpen] = React.useState(false);

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingFaculty(null);
  };

  /**
   * Handle faculty save with error handling
   */
  const handleSaveFaculty = (
    facultyId: string,
    updatedData: Partial<FacultyTableData>
  ) => {
    try {
      if (onFacultyUpdate) {
        onFacultyUpdate(facultyId, updatedData);
      }
      handleCloseEditDialog();
    } catch (error) {
      console.error("Error saving faculty:", error);
      toast.error("Failed to update faculty details");
    }
  };

  const handleCloseDemoteDialog = () => {
    setIsDemoteDialogOpen(false);
    setDemotingFaculty(null);
  };

  /**
   * Handle faculty demotion with error handling
   */
  const handleConfirmDemote = (facultyId: string) => {
    try {
      if (onFacultyDemote) {
        onFacultyDemote(facultyId);
      }
      handleCloseDemoteDialog();
    } catch (error) {
      console.error("Error demoting faculty:", error);
      toast.error("Failed to demote faculty member");
    }
  };

  const columns = createColumns(
    setEditingFaculty,
    setIsEditDialogOpen,
    setDemotingFaculty,
    setIsDemoteDialogOpen
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full space-y-4">
      {/* Table with sked UI styling */}
      <div className="border  overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b bg-muted/50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-xs font-medium text-muted-foreground"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/30 transition-colors border-b border-border/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No faculty members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} faculty member(s) total
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="cursor-pointer"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="cursor-pointer"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Edit Faculty Dialog */}
      {editingFaculty && (
        <EditFacultyDialog
          faculty={editingFaculty}
          isOpen={isEditDialogOpen}
          onClose={handleCloseEditDialog}
          onSave={handleSaveFaculty}
        />
      )}

      {/* Demote User Dialog */}
      {demotingFaculty && (
        <DemoteUserDialog
          faculty={demotingFaculty}
          isOpen={isDemoteDialogOpen}
          onClose={handleCloseDemoteDialog}
          onConfirm={handleConfirmDemote}
        />
      )}
    </div>
  );
}
