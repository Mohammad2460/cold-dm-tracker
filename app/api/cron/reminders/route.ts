export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    const users = await prisma.user.findMany({
      where: { email_reminders_enabled: true },
      include: {
        dms: {
          where: {
            status: "Waiting",
            followup_date: { gte: today, lt: tomorrow },
          },
        },
      },
    });

    let emailsSent = 0;

    for (const user of users) {
      if (user.dms.length > 0) {
        const dashboardUrl = "https://cold-dm-tracker.vercel.app/dashboard";
        const unsubscribeUrl = "https://cold-dm-tracker.vercel.app/settings?emailReminders=false";
        const userName = user.email.split("@")[0];
        
        const dmList = user.dms.map((dm) => `
          <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
            <h3 style="font-size: 18px; margin-bottom: 8px; margin-top: 0;">${dm.name}</h3>
            <p style="font-size: 14px; color: #666; margin-bottom: 8px;">Platform: ${dm.platform}</p>
            ${dm.note ? `<p style="font-size: 14px; color: #666; margin-top: 8px;">Note: ${dm.note}</p>` : ""}
          </div>
        `).join("");

        const html = `
          <!DOCTYPE html>
          <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="font-size: 24px; margin-bottom: 20px;">Your Daily DM Follow-ups</h1>
              <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>
              <p style="font-size: 16px; margin-bottom: 20px;">You have <strong>${user.dms.length}</strong> DM${user.dms.length !== 1 ? "s" : ""} due for follow-up today:</p>
              <div style="margin-bottom: 30px;">${dmList}</div>
              <div style="margin-bottom: 30px;">
                <a href="${dashboardUrl}" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Dashboard</a>
              </div>
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />
              <p style="font-size: 12px; color: #999;"><a href="${unsubscribeUrl}" style="color: #999;">Turn off daily emails</a></p>
            </body>
          </html>
        `;

        try {
          await resend.emails.send({
            from: "Cold DM Tracker <reminders@applyfast.dev>",
            to: user.email,
            subject: `You have ${user.dms.length} DM${user.dms.length !== 1 ? "s" : ""} due for follow-up today`,
            html,
          });
          emailsSent++;
        } catch (error) {
          console.error(`Failed to send email to ${user.email}:`, error);
        }
      }
    }

    return NextResponse.json({ success: true, emailsSent, message: `Sent ${emailsSent} reminder emails` });
  } catch (error) {
    console.error("Error in cron job:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}