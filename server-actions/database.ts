"use server";

import { menu, restaurant } from "@/lib/database";
import { db } from "@/lib/database/drizzle";
import { eq } from "drizzle-orm";
import { v7 } from "uuid";
import {
  CreateRestaurantSchema,
  CreateMenuSchema,
  type CreateRestaurant,
  type CreateMenu,
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

  const restaurantData = await db.query.restaurant.findFirst({
    where: eq(restaurant.name, name),
  });

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

// Feeding items into the menu
export const feedMenuItems = async () => { };
