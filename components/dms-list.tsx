"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { useAllDMs, useUpdateDMStatus, type DM } from "@/lib/queries";
import { Loader2 } from "lucide-react";

/**
 * Type for tracking loading state
 * Tracks both which DM and which action is loading
 */
type LoadingState = {
  dmId: string;
  action: "In Conversation" | "Won" | "Lost" | "Waiting";
} | null;

/**
 * Type for feedback message
 */
type Feedback = {
  dmId: string;
  type: "success" | "error";
  message: string;
} | null;

/**
 * DMsList Component
 *
 * Displays all DMs in a searchable/filterable table.
 * Uses TanStack Query for data fetching and caching.
 */
export function DMsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch all DMs using TanStack Query
  const { data: allDMs = [], isLoading, error } = useAllDMs();

  // Use the mutation hook for optimistic updates
  const updateStatusMutation = useUpdateDMStatus();

  // Track feedback message for a specific DM (for UI display)
  const [feedback, setFeedback] = useState<Feedback>(null);

  // Filter DMs based on search and status
  const filteredDMs = useMemo(() => {
    let filtered = [...allDMs];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (dm) =>
          dm.name.toLowerCase().includes(query) ||
          dm.platform.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((dm) => dm.status === statusFilter);
    }

    return filtered;
  }, [allDMs, searchQuery, statusFilter]);

  /**
   * Handle status update with optimistic updates
   */
  const handleStatusUpdate = async (
    dmId: string,
    status: "In Conversation" | "Won" | "Lost" | "Waiting",
    days?: number
  ) => {
    // Prevent action if another is already in progress
    if (updateStatusMutation.isPending) return;

    setFeedback(null);

    // Use the mutation which has optimistic updates built in
    updateStatusMutation.mutate(
      { dmId, status, days },
      {
        onSuccess: (result) => {
          if (result.success) {
            setFeedback({
              dmId,
              type: "success",
              message: result.message || "Updated!",
            });
            setTimeout(() => setFeedback(null), 2000);
          } else {
            setFeedback({
              dmId,
              type: "error",
              message: result.error || "Failed to update",
            });
            setTimeout(() => setFeedback(null), 3000);
          }
        },
        onError: (error) => {
          console.error("Error updating status:", error);
          setFeedback({
            dmId,
            type: "error",
            message: "Something went wrong. Please try again.",
          });
          setTimeout(() => setFeedback(null), 3000);
        },
      }
    );
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Waiting":
        return "default";
      case "In Conversation":
        return "secondary";
      case "Won":
        return "default";
      case "Lost":
        return "destructive";
      default:
        return "default";
    }
  };

  /**
   * Check if buttons should be disabled
   */
  const isDisabled = updateStatusMutation.isPending;

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-800 text-sm">
          Failed to load DMs. Please try refreshing the page.
        </p>
      </div>
    );
  }

  if (allDMs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <p className="text-muted-foreground mb-2 text-lg">No DMs yet</p>
          <p className="text-muted-foreground mb-6">
            Start tracking your cold DMs to never miss a follow-up
          </p>
          <Button asChild>
            <Link href="/dms/add">Add Your First DM</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by name or platform..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Waiting">Waiting</SelectItem>
            <SelectItem value="In Conversation">In Conversation</SelectItem>
            <SelectItem value="Won">Won</SelectItem>
            <SelectItem value="Lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredDMs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">No DMs found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Sent Date</TableHead>
                  <TableHead>Follow-up Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDMs.map((dm) => (
                  <TableRow key={dm.id}>
                    <TableCell className="font-medium">{dm.name}</TableCell>
                    <TableCell>{dm.platform}</TableCell>
                    <TableCell>{format(new Date(dm.sent_date), "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(new Date(dm.followup_date), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(dm.status)}>
                        {dm.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col sm:flex-row justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dms/${dm.id}`}>Edit</Link>
                          </Button>
                          <div className="flex flex-wrap gap-1 justify-end">
                            {/* IN CONVERSATION BUTTON */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(dm.id, "In Conversation")}
                              disabled={isDisabled}
                              className="text-xs"
                            >
                              In Conversation
                            </Button>

                            {/* WON BUTTON */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(dm.id, "Won")}
                              disabled={isDisabled}
                            >
                              Won
                            </Button>

                            {/* LOST BUTTON */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(dm.id, "Lost")}
                              disabled={isDisabled}
                            >
                              Lost
                            </Button>

                            {/* EXTEND 3 DAYS BUTTON */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(dm.id, "Waiting", 3)}
                              disabled={isDisabled}
                              className="text-xs"
                            >
                              +3 days
                            </Button>
                          </div>
                        </div>

                        {/* FEEDBACK MESSAGE FOR THIS ROW */}
                        {feedback?.dmId === dm.id && (
                          <div
                            className={`text-xs px-2 py-1 rounded text-right ${
                              feedback.type === "success"
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {feedback.message}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
