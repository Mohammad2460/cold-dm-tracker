"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { DMStatusButtons } from "@/components/dm-status-buttons";
import { useTodayDMs, useOverdueDMs, type DM } from "@/lib/queries";
import { Loader2 } from "lucide-react";

/**
 * DashboardContent Component
 *
 * Client component that fetches and displays dashboard data using TanStack Query.
 *
 * Features:
 * - Data cached for 5 minutes (no refetch on mount if data is fresh)
 * - Automatic background refetching when window regains focus
 * - Loading states while data is being fetched
 * - Error handling with retry
 */
export function DashboardContent() {
  // Fetch today's DMs using TanStack Query
  const {
    data: todayDMs = [],
    isLoading: todayLoading,
    error: todayError,
  } = useTodayDMs();

  // Fetch overdue DMs using TanStack Query
  const {
    data: overdueDMs = [],
    isLoading: overdueLoading,
    error: overdueError,
  } = useOverdueDMs();

  const isLoading = todayLoading || overdueLoading;
  const hasError = todayError || overdueError;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Your cold DM follow-up tracker
          </p>
        </div>
        <Button asChild>
          <Link href="/dms/add">Add DM</Link>
        </Button>
      </div>

      {/* Show error state */}
      {hasError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">
            Failed to load dashboard data. Please try refreshing the page.
          </p>
        </div>
      )}

      {/* Show loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Show dashboard cards once data is loaded */}
      {!isLoading && (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Today Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Today
                  <Badge variant="secondary">{todayDMs.length}</Badge>
                </CardTitle>
                <CardDescription>DMs due for follow-up today</CardDescription>
              </CardHeader>
              <CardContent>
                {todayDMs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No DMs due today. Great job!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todayDMs.map((dm) => (
                      <DMCard key={dm.id} dm={dm} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Overdue Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Overdue
                  <Badge variant="destructive">{overdueDMs.length}</Badge>
                </CardTitle>
                <CardDescription>DMs past their follow-up date</CardDescription>
              </CardHeader>
              <CardContent>
                {overdueDMs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No overdue DMs. You&apos;re on top of it!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {overdueDMs.map((dm) => (
                      <DMCard key={dm.id} dm={dm} isOverdue />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Button variant="outline" asChild>
              <Link href="/dms">View All DMs</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * DMCard Component
 *
 * Displays a single DM card with status buttons.
 * The status buttons now use optimistic updates!
 */
function DMCard({ dm, isOverdue }: { dm: DM; isOverdue?: boolean }) {
  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{dm.name}</h3>
          <p className="text-sm text-muted-foreground">
            {dm.platform} • {format(new Date(dm.followup_date), "MMM d, yyyy")}
          </p>
        </div>
        <Badge variant={isOverdue ? "destructive" : "default"}>{dm.status}</Badge>
      </div>
      {dm.note && (
        <p className="text-sm text-muted-foreground line-clamp-2">{dm.note}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
          <Link href={`/dms/${dm.id}`}>View</Link>
        </Button>
        <div className="flex flex-wrap gap-2">
          <DMStatusButtons dmId={dm.id} />
        </div>
      </div>
    </div>
  );
}
