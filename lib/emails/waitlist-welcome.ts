export function getWaitlistWelcomeEmail(email: string, position?: number) {
  const firstName = email.split("@")[0];
  const isEarlyBird = position && position <= 50;

  const subject = position 
    ? `You're #${position} on the waitlist! 🎉` 
    : "You're on the list! 🎉";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background-color: #111111; border-radius: 12px; padding: 40px; border: 1px solid #222222;">
      
      <h1 style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0 0 24px 0;">
        Hey ${firstName}! 👋
      </h1>
      
      <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Thanks for joining the Cold DM Tracker waitlist.
      </p>
      
      ${position ? `
      <div style="text-align: center; background: linear-gradient(135deg, #1e3a5f 0%, #1a1a2e 100%); border-radius: 12px; padding: 24px; margin: 0 0 24px 0; border: 1px solid #3b82f6;">
        <p style="color: #94a3b8; font-size: 14px; margin: 0 0 8px 0;">You're waitlist member</p>
        <p style="color: #ffffff; font-size: 48px; font-weight: 700; margin: 0;">#${position}</p>
      </div>
      ` : ''}
      
      <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
        We'll email you on <strong style="color: #ffffff;">January 11, 2026</strong> when Cold DM Tracker launches.
      </p>
      
      ${isEarlyBird ? `
      <div style="background-color: #422006; border-radius: 8px; padding: 16px; margin: 0 0 24px 0; border: 1px solid #f59e0b;">
        <p style="color: #fbbf24; font-size: 14px; margin: 0;">
          🎉 <strong>Congrats!</strong> As one of the first 50 users, you're locked in for <strong>lifetime 50% off</strong> — just $2.50/month instead of $5!
        </p>
      </div>
      ` : ''}
      
      <div style="background-color: #1a1a1a; border-radius: 8px; padding: 20px; margin: 0 0 24px 0;">
        <p style="color: #ffffff; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">
          What happens next:
        </p>
        <p style="color: #a3a3a3; font-size: 14px; line-height: 1.8; margin: 0;">
          1. We're finishing up the final touches<br>
          2. You'll get an email on launch day (Jan 11, 2026)<br>
          3. Early supporters get free access during beta
        </p>
      </div>
      
      <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
        💡 <strong>Want early access?</strong> Share with 3 friends who do cold outreach:
      </p>
      
      <div style="margin: 0 0 24px 0;">
        <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent("I just joined the waitlist for Cold DM Tracker - a simple tool to track cold DMs and never miss a follow-up! Join me:")}&url=${encodeURIComponent("https://colddmtracker.com")}" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; text-decoration: none; padding: 10px 16px; border-radius: 8px; font-size: 13px; margin: 0 8px 8px 0; border: 1px solid #333;">
          Share on X →
        </a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://colddmtracker.com")}" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; text-decoration: none; padding: 10px 16px; border-radius: 8px; font-size: 13px; margin: 0 8px 8px 0; border: 1px solid #333;">
          Share on LinkedIn →
        </a>
      </div>
      
      <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
        Follow me on Twitter for updates:
      </p>
      
      <a href="https://twitter.com/SaaSbyMohd" style="display: inline-block; background-color: #ffffff; color: #000000; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; margin: 0 0 24px 0;">
        @SaaSbyMohd →
      </a>
      
      <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin: 24px 0 8px 0;">
        Thanks for believing in what we're building.
      </p>
      
      <p style="color: #ffffff; font-size: 16px; margin: 0;">
        - Mohammad
      </p>
      
    </div>
    
    <p style="color: #525252; font-size: 12px; text-align: center; margin: 24px 0 0 0;">
      Cold DM Tracker • You received this because you signed up for the waitlist
    </p>
    
  </div>
</body>
</html>
  `.trim();

  return { subject, html };
}
