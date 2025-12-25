import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";
import { format } from "date-fns";

export async function GET() {
  try {
    const user = await getOrCreateUser();

    const dms = await prisma.dM.findMany({
      where: {
        user_id: user.id,
      },
      orderBy: {
        followup_date: "asc",
      },
    });

    // Create CSV header
    const headers = ["Name", "Platform", "Sent Date", "Follow-up Date", "Status", "Note"];
    
    // Create CSV rows
    const rows = dms.map((dm) => [
      dm.name,
      dm.platform,
      format(new Date(dm.sent_date), "yyyy-MM-dd"),
      format(new Date(dm.followup_date), "yyyy-MM-dd"),
      dm.status,
      dm.note ? dm.note.replace(/"/g, '""') : "", // Escape quotes in notes
    ]);

    // Combine header and rows
    const csvContent = [
      headers.map((h) => `"${h}"`).join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="cold-dms-${format(new Date(), "yyyy-MM-dd")}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting DMs:", error);
    return NextResponse.json(
      { error: "Failed to export DMs" },
      { status: 500 }
    );
  }
}

