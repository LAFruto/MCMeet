"use client";

import { usePageContext } from "@/lib/hooks/use-chat";
import { FacultyDataTable } from "@/components/faculty-data-table";
import { PromoteUserDialog } from "@/components/promote-user-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Users } from "lucide-react";
import type { FacultyMember } from "@/lib/types";

// Local imports
import { useFacultyData, useFacultySearch } from "./hooks";
import { FACULTY_CONSTANTS } from "./constants";
import type { FacultyPromotionData } from "./types";

interface FacultyClientProps {
  initialData: FacultyMember[];
}

/**
 * Faculty Directory Client Component
 *
 * Main component for managing faculty members in the system.
 * Provides functionality for viewing, searching, editing, and promoting users to faculty.
 *
 * @param initialData - Array of faculty members from server
 */
export function FacultyClient({ initialData }: FacultyClientProps) {
  usePageContext("faculty");

  // Custom hooks for data management
  const {
    facultyData,
    tableData,
    handleFacultyUpdate,
    handleFacultyDemote,
    handleFacultyPromote,
  } = useFacultyData(initialData);

  const { searchTerm, setSearchTerm, filterFaculty } = useFacultySearch();

  // Filter data based on search
  const filteredData = filterFaculty(tableData);
  const totalFaculty = tableData.length;

  /**
   * Handle faculty promotion with proper error handling
   */
  const handlePromoteUser = (promotionData: FacultyPromotionData) => {
    handleFacultyPromote(promotionData.userId, promotionData.facultyData);
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Fixed Header matching sked UI */}
      <div className="shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Top Bar - Title and Actions */}
        <div className="flex items-center justify-between px-4 sm:px-6 h-14 border-b">
          {/* Left: Title */}
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <h1 className="text-base sm:text-lg font-semibold">
              Faculty Directory
            </h1>
            <Badge variant="secondary" className="text-xs">
              {totalFaculty} total
            </Badge>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" />
                  Promote to Faculty
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 sm:max-w-lg">
                <DialogHeader className="px-4 pt-4">
                  <DialogTitle>Promote User to Faculty</DialogTitle>
                  <DialogDescription>
                    Select a user account and configure their faculty details.
                  </DialogDescription>
                </DialogHeader>
                <PromoteUserDialog
                  onClose={() => {}}
                  onPromote={handlePromoteUser}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Second Bar - Search and Filters */}
        <div className="flex items-center justify-between px-4 sm:px-6 h-12">
          {/* Left: Search */}
          <div className="flex items-center gap-3 flex-1">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={FACULTY_CONSTANTS.SEARCH_PLACEHOLDER}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-8 text-sm"
                aria-label="Search faculty members"
              />
            </div>
          </div>

          {/* Right: Additional Filters */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              aria-label="Open filters"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <FacultyDataTable
          data={filteredData}
          onFacultyUpdate={handleFacultyUpdate}
          onFacultyDemote={handleFacultyDemote}
        />
      </div>
    </div>
  );
}
