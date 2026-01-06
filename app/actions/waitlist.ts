"use server";

import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { getWaitlistWelcomeEmail } from "@/lib/emails/waitlist-welcome";

export type WaitlistResult = {
  success: boolean;
  message: string;
  position?: number;
  isExisting?: boolean;
};

export async function getWaitlistCount(): Promise<number> {
  try {
    return await prisma.waitlist.count();
  } catch (error) {
    console.error("Error getting waitlist count:", error);
    return 0;
  }
}

export async function joinWaitlist(email: string): Promise<WaitlistResult> {
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { success: false, message: "Please enter a valid email address" };
  }

  try {
    // Check if email already exists
    const existing = await prisma.waitlist.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      // Get their position in the waitlist
      const position = await prisma.waitlist.count({
        where: {
          createdAt: { lte: existing.createdAt },
        },
      });
      return { 
        success: true, 
        message: "You're already on the list!", 
        position,
        isExisting: true 
      };
    }

    // Add to waitlist
    const newEntry = await prisma.waitlist.create({
      data: { email: email.toLowerCase() },
    });

    // Get their position (count of all entries up to and including theirs)
    const position = await prisma.waitlist.count({
      where: {
        createdAt: { lte: newEntry.createdAt },
      },
    });

    // Send welcome email (don't block on failure)
    try {
      const { subject, html } = getWaitlistWelcomeEmail(email.toLowerCase(), position);
      await resend.emails.send({
        from: "Mohammad from Cold DM Tracker <hello@applyfast.dev>",
        to: email.toLowerCase(),
        subject,
        html,
      });
    } catch (emailError) {
      console.error("Error sending waitlist welcome email:", emailError);
      // Don't fail the signup if email fails
    }

    return { success: true, message: "You're on the list!", position };
  } catch (error) {
    console.error("Error joining waitlist:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}
