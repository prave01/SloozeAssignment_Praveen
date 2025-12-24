"use server";

import { item, menu, restaurant, type RestaurantType } from "@/lib/database";
import { eq } from "drizzle-orm";
import { db } from "@/lib/database/drizzle";
import { v7 } from "uuid";
import {
  CreateRestaurantSchema,
  CreateMenuSchema,
  type CreateRestaurant,
  type CreateMenu,
  FeedItems,
  FeedItemsSchema,
} from "./zod-schema";

// Create restaurant in any location
export const createRestaurant = async ({
  name,
  location,
}: CreateRestaurant) => {
  const parsed = CreateRestaurantSchema.safeParse({
    name,
    location,
  });

  if (!parsed.success) {
    throw new Error(`Invalid input:\n ${parsed.error.message}`);
  }

  const { name: restaurantName, location: restaurantLocation } = parsed.data;

  try {
    const [createdRestaurant] = await db
      .insert(restaurant)
      .values([
        {
          id: v7(),
          name: restaurantName,
          location: restaurantLocation,
        },
      ])
      .returning();

    return createdRestaurant;
  } catch (err) {
    throw err;
  }
};

// Create menu for the restaurant
export const createMenu = async ({ restaurantName }: CreateMenu) => {
  console.log(
    "\x1b[36m%s\x1b[0m",
    `Creating new menu for restaurant: ${restaurantName}`,
  );

  const parsed = CreateMenuSchema.safeParse({
    restaurantName,
  });

  if (!parsed.success) {
    throw new Error(`Invalid input:\n ${parsed.error.message}`);
  }

  const { restaurantName: name } = parsed.data;

  const restaurantData = await getRestaurant(restaurantName);

  if (!restaurantData) {
    throw new Error("Restaurant not available");
  }

  try {
    const [createdMenu] = await db
      .insert(menu)
      .values({
        id: v7(),
        restaurantId: restaurantData.id,
      })
      .returning();

    return createdMenu;
  } catch (err: any) {
    throw err;
  }
};

// Get restaurant
export const getRestaurant = async (name: string): Promise<RestaurantType> => {
  const result = await db.query.restaurant.findFirst({
    where: eq(restaurant.name, name),
  });

  if (!result) {
    throw new Error("No restaurant found");
  }

  return result;
};

// Feeding items into the menu
export const feedMenuItems = async (items: FeedItems[]) => {
  const parsed = FeedItemsSchema.safeParse(items);

  if (!parsed.success) {
    throw new Error(`Invalid input:\n ${parsed.error.message}`);
  }

  const parsedItems = parsed.data;

  try {
    const [feededItems] = await db
      .insert(item)
      .values([...parsedItems])
      .returning();

    return feededItems;
  } catch (err: any) {
    throw err;
  }
};
