import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

/**
 * Get the current authenticated user from Clerk
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser?.emailAddresses[0]?.emailAddress) return null;

  return {
    clerkId: userId,
    email: clerkUser.emailAddresses[0].emailAddress,
  };
}

/**
 * Get or create a user in the database
 * Returns the user record from the database
 */
export async function getOrCreateUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  try {
    // Check if user exists in database
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    // Create user if doesn't exist
    if (!dbUser) {
      // Auto-detect timezone (fallback to America/New_York for server-side)
      let detectedTimezone = "America/New_York";
      try {
        detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
      } catch (e) {
        // Fallback if Intl is not available
        detectedTimezone = "America/New_York";
      }
      
      dbUser = await prisma.user.create({
        data: {
          email: user.email,
          timezone: detectedTimezone,
          email_reminders_enabled: true,
          onboarded: false,
        },
      });
    }

    return dbUser;
  } catch (error: any) {
    console.error("Database error in getOrCreateUser:", error);
    throw error;
  }
}
