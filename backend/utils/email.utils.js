import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email, otp) {
  await resend.emails.send({
    from: "AIStartupIdeaGenerator <onboarding@resend.dev>",
    to: email,
    subject: "Email Verification Code",
    html: `
      <h2>Email Verification</h2>
      <p>Your verification code is:</p>
      <h1>${otp}</h1>
      <p>This code expires in 10 minutes.</p>
    `,
  });
}

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}