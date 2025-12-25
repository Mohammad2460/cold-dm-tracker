"use server";

import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Update user settings
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

