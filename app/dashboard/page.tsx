export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format, startOfDay } from "date-fns";
import { redirect } from "next/navigation";
import { DMStatusButtons } from "@/components/dm-status-buttons";
import type { DM } from "@prisma/client";

export default async function DashboardPage() {
  const user = await getOrCreateUser();

  // Check if user needs onboarding (which happens after timezone confirmation)
  if (!user.onboarded) {
    redirect("/onboarding");
  }

  const today = startOfDay(new Date());

  let todayDMs: DM[] = [];
  let overdueDMs: DM[] = [];

  try {
    // Get DMs due today
    todayDMs = await prisma.dM.findMany({
      where: {
        user_id: user.id,
        followup_date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      orderBy: {
        followup_date: "asc",
      },
    });

    // Get overdue DMs (followup_date < today AND status = "Waiting")
    overdueDMs = await prisma.dM.findMany({
      where: {
        user_id: user.id,
        followup_date: {
          lt: today,
        },
        status: "Waiting",
      },
      orderBy: {
        followup_date: "asc",
      },
    });
  } catch (error: any) {
    console.error("Error fetching DMs:", error);
    // Continue with empty arrays if database query fails
  }

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
                <p className="text-muted-foreground">No overdue DMs. You&apos;re on top of it!</p>
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
    </div>
  );
}

function DMCard({ dm, isOverdue }: { dm: any; isOverdue?: boolean }) {
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
