export function getWaitlistWelcomeEmail(email: string) {
  const firstName = email.split("@")[0];

  const subject = "You're on the list! 🎉";

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
      
      <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
        You're now in line to get early access to the simplest way to track your cold DMs and never miss a follow-up.
      </p>
      
      <div style="background-color: #1a1a1a; border-radius: 8px; padding: 20px; margin: 0 0 24px 0;">
        <p style="color: #ffffff; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">
          What happens next:
        </p>
        <p style="color: #a3a3a3; font-size: 14px; line-height: 1.8; margin: 0;">
          1. We're finishing up the final touches<br>
          2. You'll get an email when we're ready to let you in<br>
          3. Early supporters get free access during beta
        </p>
      </div>
      
      <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
        Want updates? Follow me on Twitter:
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
