"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { updateDM, type FormState } from "@/app/actions/dms";
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
import { DeleteDMButton } from "@/components/delete-dm-button";
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
      {pending ? "Updating..." : "Update DM"}
    </Button>
  );
}

/**
 * EditDMForm Component
 *
 * Client component that handles editing a DM with proper loading and error states.
 * Uses React's useFormState hook to manage server-side validation and error feedback.
 */
export function EditDMForm({
  dm,
}: {
  dm: {
    id: string;
    name: string;
    platform: string;
    followup_date: string;
    note: string | null;
  };
}) {
  const router = useRouter();

  // useFormState manages form submission state and captures server-side errors
  // - state: contains { success, error, message } from the server action
  // - formAction: the action to pass to the form's action prop
  const [state, formAction] = useFormState<FormState, FormData>(updateDM, {
    success: false,
  });

  // Handle successful form submission
  useEffect(() => {
    if (state?.success) {
      // Show success message for 1.5 seconds before redirecting
      // This gives the user visual feedback that their action was successful
      const timer = setTimeout(() => {
        router.push("/dms");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [state?.success, router]);

  return (
    <>
      {/*
        SUCCESS MESSAGE
        Show a green success message when the DM is updated successfully
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
        Uses formAction from useFormState instead of directly calling updateDM.
        This allows React to intercept the submission and update the state.
      */}
      <form action={formAction} className="space-y-6">
        {/* Hidden field to pass DM ID to server action */}
        <input type="hidden" name="id" value={dm.id} />

        {/* NAME FIELD */}
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            defaultValue={dm.name}
            required
          />
        </div>

        {/* PLATFORM FIELD */}
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

        {/* FOLLOW-UP DATE FIELD */}
        <div className="space-y-2">
          <Label htmlFor="followup_date">Follow-up Date *</Label>
          <Input
            id="followup_date"
            name="followup_date"
            type="date"
            defaultValue={dm.followup_date}
            required
          />
        </div>

        {/* NOTE FIELD */}
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

        {/* ACTION BUTTONS */}
        <div className="flex gap-4">
          {/*
            SubmitButton component shows loading state automatically
            It must be a separate component to use useFormStatus
          */}
          <SubmitButton />

          <Button type="button" variant="outline" asChild>
            <Link href="/dms">Cancel</Link>
          </Button>

          {/* Delete button with its own loading state */}
          <DeleteDMButton dmId={dm.id} />
        </div>
      </form>
    </>
  );
}
