import { z } from "zod";

export const CreateRestaurantSchema = z.object({
  name: z.string(),
  location: z.enum(["india", "america"]),
});

export type CreateRestaurant = z.infer<typeof CreateRestaurantSchema>;

export const CreateMenuSchema = z.object({
  restaurantName: z.string(),
});

export type CreateMenu = z.infer<typeof CreateMenuSchema>;

const ItemBaseSchema = z.object({
  name: z.string(),
  cost: z.number().positive(),
  menuId: z.string(),
  elapsedTime: z.string(),
  imageUrl: z.string(),
  restaurantName: z.string(),
});

export const FeedItemsSchema = z.array(ItemBaseSchema);

export type FeedItems = z.infer<typeof ItemBaseSchema>;
