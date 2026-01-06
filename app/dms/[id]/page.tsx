export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { EditDMForm } from "@/components/edit-dm-form";

/**
 * DM Detail Page (Server Component)
 *
 * This page fetches the DM data from the database and passes it to the
 * EditDMForm client component. Keeping data fetching in the server component
 * is more efficient and secure.
 */
export default async function DMDetailPage({ params }: { params: { id: string } }) {
  // Authenticate user
  const user = await getOrCreateUser();

  // Fetch DM from database
  const dm = await prisma.dM.findFirst({
    where: {
      id: params.id,
      user_id: user.id,
    },
  });

  // Return 404 if DM not found or doesn't belong to user
  if (!dm) {
    notFound();
  }

  // Format the date for the date input
  const followupDateString = format(new Date(dm.followup_date), "yyyy-MM-dd");

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-6">
        <Link href="/dms" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to All DMs
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit DM</CardTitle>
          <CardDescription>Update DM details</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Client component handles form submission with loading states */}
          <EditDMForm
            dm={{
              id: dm.id,
              name: dm.name,
              platform: dm.platform,
              followup_date: followupDateString,
              note: dm.note,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
