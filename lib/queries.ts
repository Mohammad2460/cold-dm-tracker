"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDMStatus, type FormState } from "@/app/actions/dms";

/**
 * DM Type
 */
export type DM = {
  id: string;
  user_id: string;
  name: string;
  platform: string;
  sent_date: Date | string;
  followup_date: Date | string;
  status: string;
  note: string | null;
  created_at: Date | string;
};

/**
 * Query Keys
 *
 * Centralized query keys for consistent cache management.
 */
export const queryKeys = {
  dms: {
    all: ["dms"] as const,
    today: ["dms", "today"] as const,
    overdue: ["dms", "overdue"] as const,
  },
};

/**
 * Fetch all DMs
 *
 * API call to get all DMs for the authenticated user.
 */
async function fetchDMs(): Promise<DM[]> {
  const response = await fetch("/api/dms");
  if (!response.ok) {
    throw new Error("Failed to fetch DMs");
  }
  return response.json();
}

/**
 * useAllDMs Hook
 *
 * Fetches all DMs with TanStack Query caching.
 *
 * Features:
 * - Data cached for 5 minutes (configured in providers.tsx)
 * - Automatically refetches when window regains focus
 * - Returns loading, error, and data states
 */
export function useAllDMs() {
  return useQuery({
    queryKey: queryKeys.dms.all,
    queryFn: fetchDMs,
  });
}

/**
 * useTodayDMs Hook
 *
 * Derived query that filters DMs due today from the cached "all DMs" data.
 * This avoids making a separate API call.
 */
export function useTodayDMs() {
  const { data: allDMs, ...rest } = useAllDMs();

  const todayDMs = allDMs?.filter((dm) => {
    if (dm.status !== "Waiting") return false;

    const today = new Date();
    const followupDate = new Date(dm.followup_date);

    // Check if followup_date is today
    return (
      followupDate.getDate() === today.getDate() &&
      followupDate.getMonth() === today.getMonth() &&
      followupDate.getFullYear() === today.getFullYear()
    );
  });

  return {
    data: todayDMs,
    ...rest,
  };
}

/**
 * useOverdueDMs Hook
 *
 * Derived query that filters overdue DMs from the cached "all DMs" data.
 */
export function useOverdueDMs() {
  const { data: allDMs, ...rest } = useAllDMs();

  const overdueDMs = allDMs?.filter((dm) => {
    if (dm.status !== "Waiting") return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const followupDate = new Date(dm.followup_date);
    followupDate.setHours(0, 0, 0, 0);

    return followupDate < today;
  });

  return {
    data: overdueDMs,
    ...rest,
  };
}

/**
 * useUpdateDMStatus Hook
 *
 * Mutation hook for updating DM status with optimistic updates.
 *
 * Features:
 * - UI updates immediately (optimistic update)
 * - Automatically syncs with server
 * - Reverts on error
 * - Invalidates cache on success
 */
export function useUpdateDMStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dmId,
      status,
      days,
    }: {
      dmId: string;
      status: string;
      days?: number;
    }): Promise<FormState> => {
      return updateDMStatus(dmId, status, days);
    },

    // Optimistic update: Update UI immediately before server responds
    onMutate: async ({ dmId, status, days }) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.dms.all });

      // Snapshot the previous value for rollback
      const previousDMs = queryClient.getQueryData<DM[]>(queryKeys.dms.all);

      // Optimistically update the cache
      queryClient.setQueryData<DM[]>(queryKeys.dms.all, (old) => {
        if (!old) return old;

        return old.map((dm) => {
          if (dm.id === dmId) {
            const updates: Partial<DM> = { status };

            // If extending by days, update followup_date
            if (days !== undefined) {
              const newDate = new Date();
              newDate.setDate(newDate.getDate() + days);
              updates.followup_date = newDate.toISOString();
            }

            return { ...dm, ...updates };
          }
          return dm;
        });
      });

      // Return context for rollback
      return { previousDMs };
    },

    // If mutation fails, rollback to previous value
    onError: (error, variables, context) => {
      if (context?.previousDMs) {
        queryClient.setQueryData(queryKeys.dms.all, context.previousDMs);
      }
    },

    // Always refetch after error or success to sync with server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dms.all });
    },
  });
}
