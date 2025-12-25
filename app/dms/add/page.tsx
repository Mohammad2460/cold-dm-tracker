import { addDM } from "@/app/actions/dms";
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
import Link from "next/link";

export default function AddDMPage() {
  // Default followup date is 3 days from now
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 3);
  const defaultDateString = defaultDate.toISOString().split("T")[0];

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to Dashboard
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New DM</CardTitle>
          <CardDescription>Track a new cold DM you sent</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={addDM} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform *</Label>
              <Select name="platform" required>
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
                defaultValue={defaultDateString}
                required
              />
              <p className="text-sm text-muted-foreground">
                When should you follow up? (Default: 3 days from now)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <textarea
                id="note"
                name="note"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Add any notes about this DM..."
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Add DM
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

