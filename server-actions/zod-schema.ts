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

export const FeedMenuItems = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      menuId: z.string(),
      name: z.string(),
      imageUrl: z.url(),
      cost: z.number(),
      elaspedTime: z.string(),
    }),
  ),
});
