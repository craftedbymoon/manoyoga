export interface IEmailService {
  sendBookingConfirmation(bookingId: string, recipientEmail: string, studentName: string, program: string, date: string, time: string): Promise<boolean>;
  sendBookingStatusUpdate(bookingId: string, recipientEmail: string, studentName: string, status: string): Promise<boolean>;
}

class EmailService implements IEmailService {
  async sendBookingConfirmation(
    bookingId: string,
    recipientEmail: string,
    studentName: string,
    program: string,
    date: string,
    time: string
  ): Promise<boolean> {
    console.log(`[EmailService] Sending Booking Confirmation to ${recipientEmail}`);
    console.log(`Booking ID: ${bookingId}, Student: ${studentName}, Program: ${program}, Slot: ${date} @ ${time}`);
    // Simulated delivery delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return true;
  }

  async sendBookingStatusUpdate(
    bookingId: string,
    recipientEmail: string,
    studentName: string,
    status: string
  ): Promise<boolean> {
    console.log(`[EmailService] Sending Booking Status Update to ${recipientEmail}`);
    console.log(`Booking ID: ${bookingId}, Student: ${studentName}, New Status: ${status}`);
    // Simulated delivery delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return true;
  }
}

export const emailService = new EmailService();
