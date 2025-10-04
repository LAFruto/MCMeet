import nodemailer from "nodemailer";

/**
 * Email utility for MCMeet
 * Handles all transactional emails (auth, bookings, notifications)
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Create email transporter
 * Configure via environment variables
 */
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send email using configured transporter
 */
export async function sendMail({
  to,
  subject,
  html,
  text,
}: EmailOptions): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "MCMeet <no-reply@mcmeet.app>",
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email delivery failed");
  }
}

/**
 * Email templates for common scenarios
 */

export const emailTemplates = {
  /**
   * Meeting booking confirmation email
   */
  bookingConfirmation: ({
    studentName,
    facultyName,
    date,
    startTime,
    endTime,
    location,
    purpose,
  }: {
    studentName: string;
    facultyName: string;
    date: string;
    startTime: string;
    endTime: string;
    location?: string;
    purpose?: string;
  }) => ({
    subject: `Meeting Confirmed with ${facultyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Meeting Confirmed</h2>
        <p>Hello ${studentName},</p>
        <p>Your meeting has been successfully scheduled.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Meeting Details</h3>
          <p><strong>Faculty:</strong> ${facultyName}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
          ${location ? `<p><strong>Location:</strong> ${location}</p>` : ""}
          ${purpose ? `<p><strong>Purpose:</strong> ${purpose}</p>` : ""}
        </div>
        
        <p>If you need to reschedule or cancel, please use the MCMeet chat interface.</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This is an automated message from MCMeet. Please do not reply to this email.
        </p>
      </div>
    `,
  }),

  /**
   * Meeting rescheduled notification
   */
  bookingRescheduled: ({
    studentName,
    facultyName,
    oldDate,
    newDate,
    newStartTime,
    newEndTime,
  }: {
    studentName: string;
    facultyName: string;
    oldDate: string;
    newDate: string;
    newStartTime: string;
    newEndTime: string;
  }) => ({
    subject: `Meeting Rescheduled - ${facultyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Meeting Rescheduled</h2>
        <p>Hello ${studentName},</p>
        <p>Your meeting with ${facultyName} has been rescheduled.</p>
        
        <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
          <p style="margin: 0;"><strong>Previous:</strong> ${oldDate}</p>
        </div>
        
        <div style="background: #d1ecf1; padding: 15px; border-left: 4px solid #0dcaf0; margin: 20px 0;">
          <p style="margin: 0;"><strong>New Date:</strong> ${newDate}</p>
          <p style="margin: 5px 0 0;"><strong>New Time:</strong> ${newStartTime} - ${newEndTime}</p>
        </div>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This is an automated message from MCMeet. Please do not reply to this email.
        </p>
      </div>
    `,
  }),

  /**
   * Meeting cancellation notification
   */
  bookingCancelled: ({
    studentName,
    facultyName,
    date,
    startTime,
    reason,
  }: {
    studentName: string;
    facultyName: string;
    date: string;
    startTime: string;
    reason?: string;
  }) => ({
    subject: `Meeting Cancelled - ${facultyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">Meeting Cancelled</h2>
        <p>Hello ${studentName},</p>
        <p>Your meeting with ${facultyName} scheduled for ${date} at ${startTime} has been cancelled.</p>
        
        ${
          reason
            ? `<div style="background: #f8d7da; padding: 15px; border-left: 4px solid #dc3545; margin: 20px 0;">
          <p style="margin: 0;"><strong>Reason:</strong> ${reason}</p>
        </div>`
            : ""
        }
        
        <p>You can schedule a new meeting through the MCMeet chat interface.</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This is an automated message from MCMeet. Please do not reply to this email.
        </p>
      </div>
    `,
  }),

  /**
   * Password reset email
   */
  passwordReset: ({
    userName,
    resetUrl,
  }: {
    userName: string;
    resetUrl: string;
  }) => ({
    subject: "Reset Your MCMeet Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello ${userName},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p style="color: #666;">Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
        
        <p style="color: #dc3545; margin-top: 30px;">
          <strong>Important:</strong> This link will expire in 1 hour.
        </p>
        
        <p style="color: #666;">If you didn't request this, please ignore this email.</p>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This is an automated message from MCMeet. Please do not reply to this email.
        </p>
      </div>
    `,
  }),
};

