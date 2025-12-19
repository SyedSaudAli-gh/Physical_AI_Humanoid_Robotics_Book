import { betterAuth } from "better-auth";

export const auth = betterAuth({
  // Database configuration would go here
  // For GitHub Pages, we'll use client-side auth only
  database: undefined, // No database for static site

  // Custom fields for user registration
  user: {
    additionalFields: {
      software_background: {
        type: "string",
        required: true,
      },
      hardware_background: {
        type: "string",
        required: true,
      },
      language_preference: {
        type: "string",
        required: false,
        defaultValue: "en",
      },
    },
  },

  // Session configuration
  session: {
    expiresIn: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  // Social providers can be added here if needed
  socialProviders: {
    // google: {
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // },
  },

  // Email verification (optional)
  emailVerification: {
    enabled: false, // For MVP, we'll skip email verification
  },

  // Account management
  account: {
    accountModel: {
      provider: "string",
      providerAccountId: "string",
      refreshToken: "string",
      accessToken: "string",
      expiresAt: "number",
      tokenType: "string",
      scope: "string",
    },
  },

  // API endpoint configuration
  api: {
    defaultRedirect: "/",
  },

  // UI configuration
  ui: {
    enabled: true,
  },
});