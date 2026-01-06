"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateUserSettingsForm, type FormState } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

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
      disabled={pending} // Disable button while form is submitting
    >
      {pending ? "Saving..." : "Save Settings"}
    </Button>
  );
}

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

/**
 * SettingsForm Component
 *
 * Client component that handles updating user settings with proper loading and error states.
 * Uses React's useFormState hook to manage server-side validation and error feedback.
 */
export function SettingsForm({
  user,
}: {
  user: {
    timezone: string;
    email_reminders_enabled: boolean;
  };
}) {
  // useFormState manages form submission state and captures server-side errors
  // - state: contains { success, error, message } from the server action
  // - formAction: the action to pass to the form's action prop
  const [state, formAction] = useFormState<FormState, FormData>(
    updateUserSettingsForm,
    { success: false }
  );

  return (
    <>
      {/*
        SUCCESS MESSAGE
        Show a green success message when settings are saved successfully
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
        Uses formAction from useFormState instead of directly calling the server action.
        This allows React to intercept the submission and update the state.
      */}
      <form action={formAction} className="space-y-6">
        {/* TIMEZONE FIELD */}
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

        {/* EMAIL REMINDERS TOGGLE */}
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

        {/* SUBMIT BUTTON */}
        {/*
          SubmitButton component shows loading state automatically
          It must be a separate component to use useFormStatus
        */}
        <SubmitButton />
      </form>
    </>
  );
}
