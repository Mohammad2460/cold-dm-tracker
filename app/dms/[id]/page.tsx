import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";
import { updateDM, deleteDM } from "@/app/actions/dms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { DeleteDMButton } from "@/components/delete-dm-button";

export default async function DMDetailPage({ params }: { params: { id: string } }) {
  const user = await getOrCreateUser();

  const dm = await prisma.dM.findFirst({
    where: {
      id: params.id,
      user_id: user.id,
    },
  });

  if (!dm) {
    notFound();
  }

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
          <form action={updateDM} className="space-y-6">
            <input type="hidden" name="id" value={dm.id} />

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={dm.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform *</Label>
              <Select name="platform" defaultValue={dm.platform} required>
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="X">X (Twitter)</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="followup_date">Follow-up Date *</Label>
              <Input
                id="followup_date"
                name="followup_date"
                type="date"
                defaultValue={followupDateString}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <textarea
                id="note"
                name="note"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue={dm.note || ""}
                placeholder="Add any notes about this DM..."
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Update DM
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dms">Cancel</Link>
              </Button>
              <DeleteDMButton dmId={dm.id} />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

