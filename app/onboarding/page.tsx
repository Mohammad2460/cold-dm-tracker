import { getOrCreateUser } from "@/lib/auth";
import { updateUserSettings } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default async function OnboardingPage() {
  const user = await getOrCreateUser();

  // If already onboarded, redirect to dashboard
  if (user.onboarded) {
    redirect("/dashboard");
  }

  async function handleComplete() {
    "use server";
    await updateUserSettings({ onboarded: true });
    redirect("/dashboard");
  }

  // If user is already onboarded, redirect to dashboard
  if (user.onboarded) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Cold DM Tracker!</CardTitle>
          <CardDescription>
            Here are 3 quick tips to get you started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-primary mt-1" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Add your first DM</h3>
                <p className="text-sm text-muted-foreground">
                  Click "Add DM" to track who you messaged, when you sent it, and when to follow up.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-primary mt-1" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Mark as 'In Conversation' when they reply</h3>
                <p className="text-sm text-muted-foreground">
                  This stops reminder emails so you don't get spammed when someone is already engaging.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-primary mt-1" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Get reminded every morning at 8 AM</h3>
                <p className="text-sm text-muted-foreground">
                  You'll receive an email with all DMs due for follow-up that day. Never miss a follow-up again!
                </p>
              </div>
            </div>
          </div>

          <form action={handleComplete}>
            <Button type="submit" className="w-full" size="lg">
              Got it!
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

