import { Resend } from 'resend';
import * as dotenv from 'dotenv';

// Load .env file explicitly
dotenv.config({ path: '.env' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev', // Fix: Use resend.dev for testing
    to: 'peaceinmind2460@gmail.com',
    subject: 'Test Email from Cold DM Tracker',
    html: '<p>If you see this, email works! 🎉</p>',
  });

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success:', data);
  }
}

testEmail();