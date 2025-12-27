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
  cost: z.number().positive(),
  menuId: z.string(),
  elapsedTime: z.string(),
  imageUrl: z.string(),
});

export type CreateItemType = z.infer<typeof ItemBaseSchema>;

export const FeedItemsSchema = z.array(ItemBaseSchema);

export type FeedItems = z.infer<typeof ItemBaseSchema>;
