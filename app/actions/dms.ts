"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";

// Zod schema for adding a DM
const addDMSchema = z.object({
  name: z.string().min(1, "Name is required"),
  platform: z.enum(["X", "LinkedIn"]),
  followup_date: z.date(),
  note: z.string().optional(),
});

// Zod schema for updating a DM
const updateDMSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  platform: z.enum(["X", "LinkedIn"]),
  followup_date: z.date(),
  note: z.string().optional(),
});

// Type for form state returned to client
export type FormState = {
  success: boolean;
  error?: string;
  message?: string;
};

/**
 * Add a new DM
 *
 * This Server Action is called from the client form using useFormState.
 * It receives the previous state and form data, validates the input,
 * creates the DM in the database, and returns success/error feedback.
 *
 * @param prevState - Previous form state (required for useFormState)
 * @param formData - Form data from the client
 * @returns FormState object with success status and optional error/message
 */
export async function addDM(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  try {
    // Authenticate user
    const user = await getOrCreateUser();

    // Extract form data
    const rawData = {
      name: formData.get("name") as string,
      platform: formData.get("platform") as "X" | "LinkedIn",
      followup_date: new Date(formData.get("followup_date") as string),
      note: formData.get("note") as string | null,
    };

    // Validate with Zod schema
    const validatedData = addDMSchema.parse(rawData);

    // Create DM in database
    await prisma.dM.create({
      data: {
        user_id: user.id,
        name: validatedData.name,
        platform: validatedData.platform,
        followup_date: validatedData.followup_date,
        note: validatedData.note || null,
        status: "Waiting",
      },
    });

    // Revalidate cache for dashboard and DMs list
    revalidatePath("/dashboard");
    revalidatePath("/dms");

    // Return success state
    return {
      success: true,
      message: "DM added successfully! Redirecting...",
    };
  } catch (error) {
    // Re-throw redirect errors to allow Next.js redirects to work
    if (isRedirectError(error)) {
      throw error;
    }

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }

    // Handle all other errors
    console.error("Error adding DM:", error);
    return {
      success: false,
      error: "Failed to add DM. Please try again.",
    };
  }
}

/**
 * Update DM status
 *
 * This Server Action updates the status of a DM (Won, Lost, In Conversation, Waiting).
 * It returns a FormState object for proper client-side feedback.
 *
 * @param dmId - The ID of the DM to update
 * @param status - The new status value
 * @param days - Optional number of days to extend the follow-up date
 * @returns FormState object with success status and optional error/message
 */
export async function updateDMStatus(
  dmId: string,
  status: string,
  days?: number
): Promise<FormState> {
  try {
    // Authenticate user
    const user = await getOrCreateUser();

    // Verify DM belongs to user
    const dm = await prisma.dM.findFirst({
      where: {
        id: dmId,
        user_id: user.id,
      },
    });

    if (!dm) {
      return {
        success: false,
        error: "DM not found or you don't have permission to update it.",
      };
    }

    const updateData: {
      status: string;
      followup_date?: Date;
    } = {
      status,
    };

    // If days is provided, update followup_date (e.g., "Remind in 3 days")
    if (days !== undefined) {
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + days);
      updateData.followup_date = newDate;
    }

    // Update DM in database
    await prisma.dM.update({
      where: { id: dmId },
      data: updateData,
    });

    // Revalidate cache for all relevant pages
    revalidatePath("/dashboard");
    revalidatePath("/dms");
    revalidatePath(`/dms/${dmId}`);

    // Return success with appropriate message
    const statusMessages: Record<string, string> = {
      "Won": "Marked as Won!",
      "Lost": "Marked as Lost",
      "In Conversation": "Marked as In Conversation",
      "Waiting": days ? `Extended by ${days} days` : "Status updated",
    };

    return {
      success: true,
      message: statusMessages[status] || "Status updated successfully",
    };
  } catch (error) {
    // Re-throw redirect errors to allow Next.js redirects to work
    if (isRedirectError(error)) {
      throw error;
    }

    // Handle all other errors
    console.error("Error updating DM status:", error);
    return {
      success: false,
      error: "Failed to update status. Please try again.",
    };
  }
}

/**
 * Update a DM
 *
 * This Server Action is called from the client form using useFormState.
 * It receives the previous state and form data, validates the input,
 * updates the DM in the database, and returns success/error feedback.
 *
 * @param prevState - Previous form state (required for useFormState)
 * @param formData - Form data from the client
 * @returns FormState object with success status and optional error/message
 */
export async function updateDM(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const dmId = formData.get("id") as string;

  try {
    // Authenticate user
    const user = await getOrCreateUser();

    // Extract form data
    const rawData = {
      id: dmId,
      name: formData.get("name") as string,
      platform: formData.get("platform") as "X" | "LinkedIn",
      followup_date: new Date(formData.get("followup_date") as string),
      note: formData.get("note") as string | null,
    };

    // Validate with Zod schema
    const validatedData = updateDMSchema.parse(rawData);

    // Verify DM belongs to user
    const dm = await prisma.dM.findFirst({
      where: {
        id: validatedData.id,
        user_id: user.id,
      },
    });

    if (!dm) {
      return {
        success: false,
        error: "DM not found or you don't have permission to edit it.",
      };
    }

    // Update DM in database
    await prisma.dM.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        platform: validatedData.platform,
        followup_date: validatedData.followup_date,
        note: validatedData.note || null,
      },
    });

    // Revalidate cache for all relevant pages
    revalidatePath("/dashboard");
    revalidatePath("/dms");
    revalidatePath(`/dms/${validatedData.id}`);

    // Return success state
    return {
      success: true,
      message: "DM updated successfully! Redirecting...",
    };
  } catch (error) {
    // Re-throw redirect errors to allow Next.js redirects to work
    if (isRedirectError(error)) {
      throw error;
    }

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }

    // Handle all other errors
    console.error("Error updating DM:", error);
    return {
      success: false,
      error: "Failed to update DM. Please try again.",
    };
  }
}

/**
 * Delete a DM
 */
export async function deleteDM(dmId: string) {
  try {
    const user = await getOrCreateUser();

    // Verify DM belongs to user
    const dm = await prisma.dM.findFirst({
      where: {
        id: dmId,
        user_id: user.id,
      },
    });

    if (!dm) {
      throw new Error("DM not found");
    }

    await prisma.dM.delete({
      where: { id: dmId },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dms");
  } catch (error) {
    // Re-throw redirect errors
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("Error deleting DM:", error);
    throw new Error("Failed to delete DM");
  }
  
  redirect("/dms");
}

