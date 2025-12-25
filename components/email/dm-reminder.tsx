import * as React from "react";

type DMReminderEmailProps = {
  userName: string;
  dms: Array<{
    name: string;
    platform: string;
    followup_date: Date;
    note?: string | null;
  }>;
  dashboardUrl: string;
  unsubscribeUrl: string;
};

export function DMReminderEmail({
  userName,
  dms,
  dashboardUrl,
  unsubscribeUrl,
}: DMReminderEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Your Daily DM Follow-ups</h1>
      
      <p style={{ fontSize: "16px", marginBottom: "20px" }}>
        Hi {userName},
      </p>

      <p style={{ fontSize: "16px", marginBottom: "20px" }}>
        You have <strong>{dms.length}</strong> DM{dms.length !== 1 ? "s" : ""} due for follow-up today:
      </p>

      <div style={{ marginBottom: "30px" }}>
        {dms.map((dm, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            <h3 style={{ fontSize: "18px", marginBottom: "8px", marginTop: "0" }}>
              {dm.name}
            </h3>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>
              Platform: {dm.platform}
            </p>
            {dm.note && (
              <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
                Note: {dm.note}
              </p>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: "30px" }}>
        <a
          href={dashboardUrl}
          style={{
            display: "inline-block",
            backgroundColor: "#000",
            color: "#fff",
            padding: "12px 24px",
            textDecoration: "none",
            borderRadius: "6px",
            fontSize: "16px",
          }}
        >
          View Dashboard
        </a>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #e0e0e0", margin: "30px 0" }} />

      <p style={{ fontSize: "12px", color: "#999", marginTop: "20px" }}>
        <a href={unsubscribeUrl} style={{ color: "#999", textDecoration: "underline" }}>
          Turn off daily emails
        </a>
      </p>
    </div>
  );
}

