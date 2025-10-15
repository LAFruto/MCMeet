import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor } from "better-auth/plugins";
import { sendMail, emailTemplates } from "./mailer";
import { prisma } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "STUDENT",
        input: false, // Users cannot set their own role
      },
      twoFactorEnabled: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      twoFactorSecret: {
        type: "string",
        required: false,
        input: false,
      },
      twoFactorVerified: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
    sendResetPassword: async ({ user, url }) => {
      try {
        const template = emailTemplates.passwordReset({
          userName: user.name,
          resetUrl: url,
        });
        await sendMail({
          to: user.email,
          subject: template.subject,
          html: template.html,
        });
      } catch (error) {
        console.error("Failed to send password reset email:", error);
        // Don't throw - we don't want to block the reset process
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!process.env.GOOGLE_CLIENT_ID,
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID || "",
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "",
      enabled: !!process.env.MICROSOFT_CLIENT_ID,
      tenantId: process.env.MICROSOFT_TENANT_ID || "",
      // Request Graph basic profile scope to allow /me call
      // Uncomment if the provider supports custom scopes in your Better Auth version
      // scope: "openid profile email User.Read",
    },
  },
  plugins: [
    twoFactor({
      // Two-factor authentication for enhanced security
      // Primarily for admin users
    }),
  ],
  secret: process.env.BETTER_AUTH_SECRET || "your-secret-key-change-this",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});
