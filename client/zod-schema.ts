import { z } from "zod";

export const LoginResolver = z.object({
  email: z.email(),
  password: z.string(),
});

export const CreateUserResolver = z.object({
  name: z.string(),
  location: z.enum(["india", "america"]),
  email: z.email(),
  password: z.string(),
  role: z.enum(["manager", "member"]),
});

export type LoginType = z.infer<typeof LoginResolver>;
export type CreateUserType = z.infer<typeof CreateUserResolver>;
