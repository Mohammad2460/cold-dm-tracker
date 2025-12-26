export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";
import { DMsList } from "@/components/dms-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DMsPage() {
  const user = await getOrCreateUser();
  
  const dms = await prisma.dM.findMany({
    where: {
      user_id: user.id,
    },
    orderBy: {
      followup_date: "asc",
    },
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">All DMs</h1>
          <p className="text-muted-foreground mt-1">
            Track all your cold DMs in one place
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/api/dms/export" download>
              Export CSV
            </a>
          </Button>
          <Button asChild>
            <Link href="/dms/add">Add DM</Link>
          </Button>
        </div>
      </div>

      <DMsList initialDMs={dms} />
    </div>
  );
}

