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

/**
 * Add a new DM
 */
export async function addDM(formData: FormData) {
  try {
    const user = await getOrCreateUser();

    const rawData = {
      name: formData.get("name") as string,
      platform: formData.get("platform") as "X" | "LinkedIn",
      followup_date: new Date(formData.get("followup_date") as string),
      note: formData.get("note") as string | null,
    };

    const validatedData = addDMSchema.parse(rawData);

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

    revalidatePath("/dashboard");
    revalidatePath("/dms");
  } catch (error) {
    // Re-throw redirect errors
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("Error adding DM:", error);
    throw new Error("Failed to add DM");
  }
  
  redirect("/dashboard");
}

/**
 * Update DM status
 */
export async function updateDMStatus(dmId: string, status: string, days?: number) {
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

    const updateData: {
      status: string;
      followup_date?: Date;
    } = {
      status,
    };

    // If status is "Remind in X days", update followup_date
    if (days !== undefined) {
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + days);
      updateData.followup_date = newDate;
    }

    await prisma.dM.update({
      where: { id: dmId },
      data: updateData,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dms");
    revalidatePath(`/dms/${dmId}`);
  } catch (error) {
    // Re-throw redirect errors
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("Error updating DM status:", error);
    throw new Error("Failed to update DM status");
  }
}

/**
 * Update a DM
 */
export async function updateDM(formData: FormData) {
  const dmId = formData.get("id") as string;
  
  try {
    const user = await getOrCreateUser();

    const rawData = {
      id: dmId,
      name: formData.get("name") as string,
      platform: formData.get("platform") as "X" | "LinkedIn",
      followup_date: new Date(formData.get("followup_date") as string),
      note: formData.get("note") as string | null,
    };

    const validatedData = updateDMSchema.parse(rawData);

    // Verify DM belongs to user
    const dm = await prisma.dM.findFirst({
      where: {
        id: validatedData.id,
        user_id: user.id,
      },
    });

    if (!dm) {
      throw new Error("DM not found");
    }

    await prisma.dM.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        platform: validatedData.platform,
        followup_date: validatedData.followup_date,
        note: validatedData.note || null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dms");
    revalidatePath(`/dms/${validatedData.id}`);
  } catch (error) {
    // Re-throw redirect errors
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("Error updating DM:", error);
    throw new Error("Failed to update DM");
  }
  
  redirect(`/dms/${dmId}`);
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

