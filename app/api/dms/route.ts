import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";

/**
 * GET /api/dms
 *
 * Fetches all DMs for the authenticated user.
 * Used by TanStack Query for client-side caching.
 *
 * Returns: Array of DM objects
 */
export async function GET() {
  try {
    // Authenticate user
    const user = await getOrCreateUser();

    // Fetch all DMs for this user
    const dms = await prisma.dM.findMany({
      where: {
        user_id: user.id,
      },
      orderBy: {
        followup_date: "asc",
      },
    });

    return NextResponse.json(dms);
  } catch (error) {
    console.error("Error fetching DMs:", error);
    return NextResponse.json(
      { error: "Failed to fetch DMs" },
      { status: 500 }
    );
  }
}
