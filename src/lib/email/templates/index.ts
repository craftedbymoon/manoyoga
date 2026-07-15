/**
 * Email Templates Module
 * Outputs responsive HTML markup for ManoYoga notifications.
 */

const sereneLayout = (title: string, content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f7f9fa;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f7f9fa;
      padding: 30px 15px;
      box-sizing: border-box;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border: 1px solid #eef2f5;
    }
    .header {
      background-color: #4f46e5; /* Primary */
      padding: 30px 40px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .body {
      padding: 40px;
      color: #334155;
    }
    .body h2 {
      font-size: 18px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 20px;
      color: #0f172a;
    }
    .body p {
      font-size: 14px;
      line-height: 1.6;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .table-container {
      background-color: #f8fafc;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
      padding: 20px;
      margin: 24px 0;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    .data-table td {
      padding: 8px 0;
      font-size: 13px;
      color: #475569;
    }
    .data-table td.label {
      font-weight: 600;
      width: 130px;
      color: #0f172a;
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px 40px;
      text-align: center;
      border-top: 1px solid #f1f5f9;
    }
    .footer p {
      font-size: 11px;
      color: #94a3b8;
      margin: 4px 0;
    }
    .btn {
      display: inline-block;
      background-color: #4f46e5;
      color: #ffffff !important;
      text-decoration: none;
      padding: 10px 20px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 6px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>ManoYoga</h1>
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        <p>ManoYoga Studio & Wellness Academy</p>
        <p>123 Serenity Way, Yoga District</p>
        <p>© ${new Date().getFullYear()} ManoYoga. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

export interface BookingDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  date: string;
  time: string;
  mode: string;
  status: string;
}

// 1. Booking Confirmation (User)
export function getBookingConfirmationTemplate(b: BookingDetails): string {
  return sereneLayout(
    "Booking Confirmation - ManoYoga",
    `
    <h2>Booking Confirmed!</h2>
    <p>Namaste ${b.name},</p>
    <p>We are delighted to confirm your upcoming yoga session. Here are your booking details:</p>
    
    <div class="table-container">
      <table class="data-table">
        <tr>
          <td class="label">Booking ID</td>
          <td>${b.id}</td>
        </tr>
        <tr>
          <td class="label">Program</td>
          <td>${b.program}</td>
        </tr>
        <tr>
          <td class="label">Date</td>
          <td>${b.date}</td>
        </tr>
        <tr>
          <td class="label">Time Slot</td>
          <td>${b.time}</td>
        </tr>
        <tr>
          <td class="label">Class Mode</td>
          <td>${b.mode}</td>
        </tr>
        <tr>
          <td class="label">Booking Status</td>
          <td style="color: #059669; font-weight: bold;">${b.status}</td>
        </tr>
      </table>
    </div>

    <p>If you need to make modifications or have physical boundaries/health constraints to share, please reply to this email directly.</p>
    <p>We look forward to meeting you on the mat.</p>
    `
  );
}

// 2. Booking Status Updated
export function getBookingStatusUpdatedTemplate(b: BookingDetails): string {
  const isConfirmed = b.status === "Confirmed";
  const statusColor = isConfirmed ? "#059669" : b.status === "Cancelled" ? "#dc2626" : "#4f46e5";

  return sereneLayout(
    "Booking Status Update - ManoYoga",
    `
    <h2>Session Status Updated</h2>
    <p>Namaste ${b.name},</p>
    <p>The status of your yoga booking has been updated by our administration team.</p>

    <div class="table-container">
      <table class="data-table">
        <tr>
          <td class="label">Booking ID</td>
          <td>${b.id}</td>
        </tr>
        <tr>
          <td class="label">Program</td>
          <td>${b.program}</td>
        </tr>
        <tr>
          <td class="label">Slot Scheduled</td>
          <td>${b.date} @ ${b.time}</td>
        </tr>
        <tr>
          <td class="label">New Status</td>
          <td style="color: ${statusColor}; font-weight: bold;">${b.status}</td>
        </tr>
      </table>
    </div>

    <p>Should you have any queries about this adjustment, please contact our support desk.</p>
    `
  );
}

// 3. Contact Form Received
export function getContactFormReceivedTemplate(name: string, subject: string): string {
  return sereneLayout(
    "We Received Your Message - ManoYoga",
    `
    <h2>Namaste ${name},</h2>
    <p>Thank you for reaching out to ManoYoga. We have successfully received your inquiry regarding:</p>
    <p style="font-style: italic; background-color: #f8fafc; padding: 12px; border-left: 3px solid #4f46e5; border-radius: 4px;">
      "${subject}"
    </p>
    <p>Our wellness instructors will review your message and respond within 24 business hours.</p>
    <p>Have a peaceful day ahead.</p>
    `
  );
}

// 4. Newsletter Welcome
export function getNewsletterWelcomeTemplate(email: string): string {
  return sereneLayout(
    "Welcome to ManoYoga Weekly Wellness",
    `
    <h2>Welcome to ManoYoga Community!</h2>
    <p>Namaste,</p>
    <p>Thank you for subscribing to our weekly newsletter. You are now part of a global collective dedicated to mindfulness, alignment, and holistic health.</p>
    <p>Every week, you'll receive handpicked tips on:</p>
    <ul>
      <li>Foundational Asanas & Corrective Alignments</li>
      <li>Breathwork (Pranayama) Practices</li>
      <li>Meditation Techniques for Mindful living</li>
      <li>Healthy Vegetarian Recipes & Ayurvedic wisdom</li>
    </ul>
    <p>We are excited to share this space with you.</p>
    `
  );
}

// 5. Admin New Booking Alert
export function getAdminBookingAlertTemplate(b: BookingDetails): string {
  return sereneLayout(
    "New Booking Alert - Admin Panel",
    `
    <h2>New Booking Reserved</h2>
    <p>An applicant has scheduled a free trial session on the landing page:</p>

    <div class="table-container">
      <table class="data-table">
        <tr>
          <td class="label">Student Name</td>
          <td>${b.name}</td>
        </tr>
        <tr>
          <td class="label">Email Address</td>
          <td>${b.email}</td>
        </tr>
        <tr>
          <td class="label">Phone Line</td>
          <td>${b.phone}</td>
        </tr>
        <tr>
          <td class="label">Service Program</td>
          <td>${b.program}</td>
        </tr>
        <tr>
          <td class="label">Slot Requested</td>
          <td>${b.date} at ${b.time}</td>
        </tr>
        <tr>
          <td class="label">Attendance Mode</td>
          <td>${b.mode}</td>
        </tr>
      </table>
    </div>

    <p><a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/bookings" class="btn">View in Dashboard</a></p>
    `
  );
}
