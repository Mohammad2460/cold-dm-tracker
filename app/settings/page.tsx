export const dynamic = "force-dynamic";

import { getOrCreateUser } from "@/lib/auth";
import { updateUserSettings } from "@/app/actions/user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { TimezoneConfirmation } from "@/components/timezone-confirmation";
import { SettingsForm } from "@/components/settings-form";

/**
 * Settings Page (Server Component)
 *
 * This page handles user settings with proper loading and error states.
 * It keeps data fetching and authentication on the server, while the form
 * is a client component with loading states.
 */
export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { emailReminders?: string; unsubscribed?: string };
}) {
  // Authenticate user
  const user = await getOrCreateUser();

  // Handle email unsubscribe from email link
  // This happens when user clicks "unsubscribe" in their reminder email
  if (searchParams.emailReminders === "false") {
    await updateUserSettings({ email_reminders_enabled: false });
    redirect("/settings?unsubscribed=true");
  }

  // Check if user needs timezone confirmation (new users who haven't confirmed)
  // Show timezone confirmation modal instead of settings form
  if (!user.onboarded) {
    return <TimezoneConfirmation user={user} />;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Show success message if user just unsubscribed via email link */}
      {searchParams.unsubscribed === "true" && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">
            Daily emails turned off. You can re-enable them below.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Client component handles form submission with loading states */}
          <SettingsForm
            user={{
              timezone: user.timezone,
              email_reminders_enabled: user.email_reminders_enabled,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
