export const dynamic = "force-dynamic";

import { getOrCreateUser } from "@/lib/auth";
import { updateUserSettings, confirmTimezone } from "@/app/actions/user";
import { prisma } from "@/lib/prisma";
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
import { Switch } from "@/components/ui/switch";
import { redirect } from "next/navigation";
import { TimezoneConfirmation } from "@/components/timezone-confirmation";

// Common timezones
const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Phoenix", label: "Arizona (MST)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HST)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
];

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { emailReminders?: string; unsubscribed?: string; updated?: string };
}) {
  const user = await getOrCreateUser();

  // Handle email unsubscribe from email link
  if (searchParams.emailReminders === "false") {
    await updateUserSettings({ email_reminders_enabled: false });
    redirect("/settings?unsubscribed=true");
  }

  // Check if user needs timezone confirmation (new users who haven't confirmed)
  // We'll show confirmation if they haven't been onboarded yet
  if (!user.onboarded) {
    return <TimezoneConfirmation user={user} />;
  }

  async function updateSettings(formData: FormData) {
    "use server";
    const timezone = formData.get("timezone") as string;
    const emailReminders = formData.get("email_reminders") === "on";

    await updateUserSettings({
      timezone,
      email_reminders_enabled: emailReminders,
    });
    redirect("/settings?updated=true");
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {searchParams.unsubscribed === "true" && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">
            Daily emails turned off. You can re-enable them below.
          </p>
        </div>
      )}

      {searchParams.updated === "true" && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">Settings updated successfully!</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateSettings} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select name="timezone" defaultValue={user.timezone}>
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Your daily reminder emails will be sent at 8 AM in this timezone.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email_reminders">Email Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Receive daily emails with DMs due for follow-up
                </p>
              </div>
              <Switch
                id="email_reminders"
                name="email_reminders"
                defaultChecked={user.email_reminders_enabled}
              />
            </div>

            <Button type="submit">Save Settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

