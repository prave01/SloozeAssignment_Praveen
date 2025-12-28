"use server";

import {
  item,
  restaurant,
  userProfile,
  type RestaurantType,
} from "@/lib/database";
import { eq } from "drizzle-orm";
import { db } from "@/lib/database/drizzle";
import { v7 } from "uuid";
import {
  CreateRestaurantSchema,
  CreateMenuSchema,
  type CreateRestaurant,
  type CreateMenu,
  type CreateUserServerType,
  type CreateItemType,
  ItemBaseSchema,
  CreateUserSchema,
} from "./zod-schema";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import cloudinary from "@/lib/cloudinary";
import { parse } from "path";

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

    const createdMenu = await createMenu({ location: restaurantLocation });

    return { ...createdRestaurant, ...createdMenu };
  } catch (err) {
    throw err;
  }
};

// Create menu for the restaurant
export const createMenu = async ({ location }: CreateMenu) => {
  const parsed = CreateMenuSchema.safeParse({
    location,
  });

  if (!parsed.success) {
    throw new Error(`Invalid input:\n ${parsed.error.message}`);
  }

  const { location: restaurantLocation } = parsed.data;

  const restaurantData = await getRestaurant(restaurantLocation);

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
export const getRestaurant = async (
  location: "america" | "india",
): Promise<RestaurantType> => {
  // const user = await auth.api.getSession({
  //   headers: await headers(),
  // });

  // if (!user?.session) {
  //   throw new Error("You are not authenticated");
  // }

  const result = await db.query.restaurant.findFirst({
    where: eq(restaurant.location, location),
  });

  if (!result) {
    throw new Error("No restaurant found");
  }

  return result;
};

// Feeding items into the menu
export const CreateItem = async (data: CreateItemType) => {
  const parsed = ItemBaseSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(`Invalid input:\n ${parsed.error.message}`);
  }

  const { name, cost, elapsedTime, image } = parsed.data;

  const imageUrl =
    typeof image === "string" && image.trim().length > 0 ? image : undefined;

  try {
    // Inserting value to the item table since the menu is already created
    // when creating the restaurant

    const [createdItem] = await db
      .insert(item)
      .values({
        name,
        image: imageUrl,
        cost,
        elapsedTime,
      })
      .returning();

    return createdItem;
  } catch (err: any) {
    throw err;
  }
};

export const uploadImage = async (file: File) => {
  // const user = await auth.api.getSession({
  //   headers: await headers(),
  // });
  //
  // if (!user?.session) {
  //   throw new Error("You are not authenticated");
  // }

  if (!file) {
    throw new Error("No file provided");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be less than 5MB");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "users",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      )
      .end(buffer);
  });

  return {
    url: result.secure_url as string,
  };
};

export const CreateUser = async (data: CreateUserServerType) => {
  try {
    const parsed = CreateUserSchema.safeParse(data);

    if (!parsed.success) {
      throw new Error(`Invalid input:\n ${parsed.error.message}`);
    }

    const { name, location, password, role, email, image } = parsed.data;

    const { id: restaurantID } = await getRestaurant(location);

    const imageUrl =
      typeof image === "string" && image.trim().length > 0 ? image : undefined;

    const res = await auth.api.signUpEmail({
      body: {
        email,
        name,
        password,
        image: imageUrl,
      },
    });

    if (!res.user.id) {
      throw new Error("Something bad happended while creating the user");
    }

    const [user] = await db
      .insert(userProfile)
      .values({
        userId: res.user.id,
        role,
        location,
        restaurantID: restaurantID,
      })
      .returning();

    return user;
  } catch (err: any) {
    throw err;
  }
};
