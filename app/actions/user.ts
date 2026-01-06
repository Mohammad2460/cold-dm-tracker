"use server";

import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Type for form state returned to client
export type FormState = {
  success: boolean;
  error?: string;
  message?: string;
};

/**
 * Update user settings (legacy function - kept for backward compatibility)
 * Used by email unsubscribe flow and other non-form actions
 */
export async function updateUserSettings(data: {
  timezone?: string;
  email_reminders_enabled?: boolean;
  onboarded?: boolean;
}) {
  try {
    const user = await getOrCreateUser();

    await prisma.user.update({
      where: { id: user.id },
      data,
    });

    revalidatePath("/settings");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw new Error("Failed to update user settings");
  }
}

/**
 * Update user settings from form submission
 *
 * This Server Action is called from the client form using useFormState.
 * It receives the previous state and form data, updates the user settings,
 * and returns success/error feedback.
 *
 * @param prevState - Previous form state (required for useFormState)
 * @param formData - Form data from the client
 * @returns FormState object with success status and optional error/message
 */
export async function updateUserSettingsForm(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  try {
    // Authenticate user
    const user = await getOrCreateUser();

    // Extract form data
    const timezone = formData.get("timezone") as string;
    const emailReminders = formData.get("email_reminders") === "on";

    // Validate timezone (basic check)
    if (!timezone || timezone.trim() === "") {
      return {
        success: false,
        error: "Please select a timezone.",
      };
    }

    // Update user settings in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        timezone,
        email_reminders_enabled: emailReminders,
      },
    });

    // Revalidate cache for settings and dashboard pages
    revalidatePath("/settings");
    revalidatePath("/dashboard");

    // Return success state
    return {
      success: true,
      message: "Settings saved successfully!",
    };
  } catch (error) {
    // Handle all errors
    console.error("Error updating user settings:", error);
    return {
      success: false,
      error: "Failed to update settings. Please try again.",
    };
  }
}

/**
 * Confirm timezone on signup
 */
export async function confirmTimezone(timezone: string) {
  try {
    const user = await getOrCreateUser();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        timezone,
      },
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error confirming timezone:", error);
    throw new Error("Failed to confirm timezone");
  }
}

