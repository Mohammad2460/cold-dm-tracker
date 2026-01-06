"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { addDM, type FormState } from "@/app/actions/dms";
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

/**
 * SubmitButton Component
 *
 * This component uses useFormStatus to detect when the form is being submitted.
 * It shows different text and disabled state based on the submission status.
 *
 * IMPORTANT: This must be a separate component because useFormStatus only works
 * inside a component that's a child of a <form> element.
 */
function SubmitButton() {
  // useFormStatus gives us the current state of the parent form
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="flex-1"
      disabled={pending} // Disable button while form is submitting
    >
      {pending ? "Adding..." : "Add DM"}
    </Button>
  );
}

/**
 * AddDMPage Component
 *
 * Client component that handles adding a new DM with proper loading and error states.
 * Uses React's useFormState hook to manage server-side validation and error feedback.
 */
export default function AddDMPage() {
  const router = useRouter();

  // Default followup date is 3 days from now
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 3);
  const defaultDateString = defaultDate.toISOString().split("T")[0];

  // useFormState manages form submission state and captures server-side errors
  // - state: contains { success, error, message } from the server action
  // - formAction: the action to pass to the form's action prop
  // - null: initial state before any submission
  const [state, formAction] = useFormState<FormState, FormData>(addDM, {
    success: false,
  });

  // Handle successful form submission
  useEffect(() => {
    if (state?.success) {
      // Show success message for 1.5 seconds before redirecting
      // This gives the user visual feedback that their action was successful
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [state?.success, router]);

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
          {/*
            SUCCESS MESSAGE
            Show a green success message when the DM is added successfully
          */}
          {state?.success && state?.message && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 text-sm font-medium">{state.message}</p>
            </div>
          )}

          {/*
            ERROR MESSAGE
            Show a red error message if validation fails or server error occurs
          */}
          {state?.error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm font-medium">{state.error}</p>
            </div>
          )}

          {/*
            FORM
            Uses formAction from useFormState instead of directly calling addDM.
            This allows React to intercept the submission and update the state.
          */}
          <form action={formAction} className="space-y-6">
            {/* NAME FIELD */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
              />
            </div>

            {/* PLATFORM FIELD */}
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

            {/* FOLLOW-UP DATE FIELD */}
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

            {/* NOTE FIELD */}
            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <textarea
                id="note"
                name="note"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Add any notes about this DM..."
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4">
              {/*
                SubmitButton component shows loading state automatically
                It must be a separate component to use useFormStatus
              */}
              <SubmitButton />

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
