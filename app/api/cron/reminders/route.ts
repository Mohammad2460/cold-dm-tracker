import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { formatInTimeZone, startOfDay, format } from "date-fns-tz";

// This endpoint should be called by a cron job (e.g., Vercel Cron)
// It runs daily and sends reminders to users at 8 AM in their timezone
export async function GET(request: Request) {
  // Verify this is a cron request (add your own auth mechanism)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all users with email reminders enabled
    const users = await prisma.user.findMany({
      where: {
        email_reminders_enabled: true,
      },
      include: {
        dms: {
          where: {
            status: "Waiting",
          },
        },
      },
    });

    const now = new Date();
    let emailsSent = 0;

    for (const user of users) {
      // Get today's date in user's timezone
      const todayInUserTz = formatInTimeZone(now, user.timezone, "yyyy-MM-dd");
      const todayStart = startOfDay(
        new Date(`${todayInUserTz}T00:00:00`),
        { timeZone: user.timezone }
      );
      const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

      // Find DMs due today in user's timezone
      const dmsDueToday = user.dms.filter((dm) => {
        const followupDate = new Date(dm.followup_date);
        return followupDate >= todayStart && followupDate < todayEnd;
      });

      // Only send email if there are DMs due today
      if (dmsDueToday.length > 0) {
        // Check if it's 8 AM in user's timezone (approximate check)
        const userTime = formatInTimeZone(now, user.timezone, "HH");
        const userHour = parseInt(userTime, 10);

        // Only send if it's around 8 AM (between 7:30 and 8:30 AM)
        if (userHour === 8) {
          const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`;
          const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/settings?emailReminders=false`;

          try {
            const userName = user.email.split("@")[0];
            const dmList = dmsDueToday
              .map(
                (dm) => `
              <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                <h3 style="font-size: 18px; margin-bottom: 8px; margin-top: 0;">${dm.name}</h3>
                <p style="font-size: 14px; color: #666; margin-bottom: 8px;">Platform: ${dm.platform}</p>
                ${dm.note ? `<p style="font-size: 14px; color: #666; margin-top: 8px;">Note: ${dm.note}</p>` : ""}
              </div>
            `
              )
              .join("");

            const html = `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h1 style="font-size: 24px; margin-bottom: 20px;">Your Daily DM Follow-ups</h1>
                  
                  <p style="font-size: 16px; margin-bottom: 20px;">
                    Hi ${userName},
                  </p>

                  <p style="font-size: 16px; margin-bottom: 20px;">
                    You have <strong>${dmsDueToday.length}</strong> DM${dmsDueToday.length !== 1 ? "s" : ""} due for follow-up today:
                  </p>

                  <div style="margin-bottom: 30px;">
                    ${dmList}
                  </div>

                  <div style="margin-bottom: 30px;">
                    <a href="${dashboardUrl}" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 16px;">
                      View Dashboard
                    </a>
                  </div>

                  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />

                  <p style="font-size: 12px; color: #999; margin-top: 20px;">
                    <a href="${unsubscribeUrl}" style="color: #999; text-decoration: underline;">
                      Turn off daily emails
                    </a>
                  </p>
                </body>
              </html>
            `;

            await resend.emails.send({
              from: "Cold DM Tracker <onboarding@resend.dev>", // Update with your verified domain
              to: user.email,
              subject: `You have ${dmsDueToday.length} DM${dmsDueToday.length !== 1 ? "s" : ""} due for follow-up today`,
              html,
            });

            emailsSent++;
          } catch (error) {
            console.error(`Failed to send email to ${user.email}:`, error);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      emailsSent,
      message: `Sent ${emailsSent} reminder emails`,
    });
  } catch (error) {
    console.error("Error in cron job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

