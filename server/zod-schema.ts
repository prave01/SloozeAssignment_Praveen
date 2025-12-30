import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  location: z.enum(["india", "america"]),
  image: z.string().optional(),
  role: z.enum(["member", "manager"]),
});

export type CreateUserServerType = z.infer<typeof CreateUserSchema>;

export const CreateRestaurantSchema = z.object({
  name: z.string(),
  location: z.enum(["india", "america"]),
});

export type CreateRestaurant = z.infer<typeof CreateRestaurantSchema>;

export const CreateMenuSchema = z.object({
  location: z.enum(["america", "india"]),
});

export type CreateMenu = z.infer<typeof CreateMenuSchema>;

export const ItemBaseSchema = z.object({
  name: z.string(),
  cost: z.number(),
  elapsedTime: z.string(),
  image: z.string().optional(),
  location: z.enum(["america", "india"]),
});

export type CreateItemType = z.infer<typeof ItemBaseSchema>;
