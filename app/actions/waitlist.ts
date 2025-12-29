"use server";

import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { getWaitlistWelcomeEmail } from "@/lib/emails/waitlist-welcome";

export async function joinWaitlist(email: string): Promise<{ success: boolean; message: string }> {
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
      return { success: true, message: "You're already on the list! We'll be in touch soon." };
    }

    // Add to waitlist
    await prisma.waitlist.create({
      data: { email: email.toLowerCase() },
    });

    // Send welcome email (don't block on failure)
    try {
      const { subject, html } = getWaitlistWelcomeEmail(email.toLowerCase());
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

    return { success: true, message: "You're on the list! We'll be in touch soon." };
  } catch (error) {
    console.error("Error joining waitlist:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}
