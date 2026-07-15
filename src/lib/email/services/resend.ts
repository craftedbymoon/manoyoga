import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM || "onboarding@resend.dev";
const adminEmail = process.env.ADMIN_EMAIL || "admin@manoyoga.com";

// Initialize Resend client if key is present
const resend = apiKey ? new Resend(apiKey) : null;

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Utility to deliver emails via Resend or log to console when unconfigured.
 */
export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    if (!resend) {
      console.log("==================================================");
      console.log(`[Email Mock Logger] (RESEND_API_KEY not configured)`);
      console.log(`To: ${to}`);
      console.log(`From: ${emailFrom}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body Length: ${html.length} chars`);
      console.log("==================================================");
      return { success: true };
    }

    const response = await resend.emails.send({
      from: emailFrom,
      to,
      subject,
      html,
    });

    if (response.error) {
      console.error("[EmailService Error]:", response.error);
      return { success: false, error: response.error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("[EmailService Fatal Error]:", error);
    return { success: false, error: error.message || "An unexpected sending failure occurred." };
  }
}

export function getAdminEmailAddress(): string {
  return adminEmail;
}
