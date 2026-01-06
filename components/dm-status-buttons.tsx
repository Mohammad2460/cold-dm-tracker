"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUpdateDMStatus } from "@/lib/queries";

/**
 * Type for tracking which action is currently loading
 * null = no action in progress
 * string = the status being updated (e.g., "Won", "Lost", etc.)
 */
type LoadingAction = "In Conversation" | "Won" | "Lost" | "Waiting" | null;

/**
 * Type for feedback message shown after action completes
 */
type Feedback = {
  type: "success" | "error";
  message: string;
} | null;

/**
 * DMStatusButtons Component
 *
 * Displays action buttons to update the status of a DM.
 * Handles loading states, prevents spam-clicking, and shows feedback.
 *
 * Features:
 * - Shows loading text on the clicked button
 * - Disables ALL buttons while any action is in progress
 * - Shows success/error feedback after action completes
 * - Prevents race conditions from simultaneous clicks
 */
export function DMStatusButtons({ dmId }: { dmId: string }) {
  // Use the mutation hook for optimistic updates
  const updateStatusMutation = useUpdateDMStatus();

  // Track which action is loading for button text
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);

  // Track feedback message to show after action completes
  const [feedback, setFeedback] = useState<Feedback>(null);

  /**
   * Handle status update with optimistic updates
   *
   * @param status - The new status to set
   * @param days - Optional days to extend follow-up date
   */
  const handleStatusUpdate = async (status: LoadingAction, days?: number) => {
    // Prevent action if another is already in progress
    if (updateStatusMutation.isPending || status === null) return;

    // Set loading state for button UI
    setLoadingAction(status);
    setFeedback(null);

    // Use the mutation with optimistic updates
    updateStatusMutation.mutate(
      { dmId, status, days },
      {
        onSuccess: (result) => {
          if (result.success) {
            setFeedback({
              type: "success",
              message: result.message || "Updated!",
            });
            setTimeout(() => setFeedback(null), 2000);
          } else {
            setFeedback({
              type: "error",
              message: result.error || "Failed to update",
            });
            setTimeout(() => setFeedback(null), 3000);
          }
          setLoadingAction(null);
        },
        onError: (error) => {
          console.error("Error updating status:", error);
          setFeedback({
            type: "error",
            message: "Something went wrong. Please try again.",
          });
          setTimeout(() => setFeedback(null), 3000);
          setLoadingAction(null);
        },
      }
    );
  };

  // Check if any action is in progress (used to disable all buttons)
  const isAnyLoading = updateStatusMutation.isPending;

  return (
    <div className="flex flex-col gap-2">
      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap gap-2">
        {/* IN CONVERSATION BUTTON */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusUpdate("In Conversation")}
          disabled={isAnyLoading}
          className="text-xs sm:text-sm"
        >
          {loadingAction === "In Conversation" ? (
            "Updating..."
          ) : (
            <>
              <span className="hidden sm:inline">In Conversation</span>
              <span className="sm:hidden">In Convo</span>
            </>
          )}
        </Button>

        {/* WON BUTTON */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusUpdate("Won")}
          disabled={isAnyLoading}
        >
          {loadingAction === "Won" ? "Marking..." : "Won"}
        </Button>

        {/* LOST BUTTON */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusUpdate("Lost")}
          disabled={isAnyLoading}
        >
          {loadingAction === "Lost" ? "Marking..." : "Lost"}
        </Button>

        {/* EXTEND 3 DAYS BUTTON */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusUpdate("Waiting", 3)}
          disabled={isAnyLoading}
          className="text-xs sm:text-sm"
        >
          {loadingAction === "Waiting" ? (
            "Extending..."
          ) : (
            <>
              <span className="hidden sm:inline">Remind in 3 days</span>
              <span className="sm:hidden">+3 days</span>
            </>
          )}
        </Button>
      </div>

      {/* FEEDBACK MESSAGE */}
      {feedback && (
        <div
          className={`text-xs px-2 py-1 rounded ${
            feedback.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
}
