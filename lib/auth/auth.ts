import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { db } from "../database/drizzle";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as authSchema from "@/lib/database/auth/auth-schema";
import * as authRelations from "@/lib/database/auth/relations";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...authSchema,
      ...authRelations,
    },
  }),
  experimental: { joins: true },
  plugins: [nextCookies()],
});
