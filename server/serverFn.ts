"use server";

import {
  item,
  menu,
  menuItem,
  order,
  orderItem,
  paymentMethod,
  restaurant,
  userProfile,
  type RestaurantType,
} from "@/lib/database";
import { and, eq, ilike } from "drizzle-orm";
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
  CreatePaymentMethodType,
  CreatePaymentMethodSchema,
} from "./zod-schema";
import { auth } from "@/lib/auth/auth";
import cloudinary from "@/lib/cloudinary";

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

export const getMenuId = async (location: "america" | "india") => {
  try {
    const result = await db.query.restaurant.findFirst({
      with: {
        menu: true,
      },
      where: eq(restaurant.location, location),
    });

    return result?.menu?.id;
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

export const getRestaurantById = async (restaurantId: string) => {
  try {
    const result = await db.query.restaurant.findFirst({
      where: eq(restaurant.id, restaurantId),
    });

    return result;
  } catch (err: any) {
    throw err;
  }
};

// Feeding items into the menu
export const CreateItem = async (data: CreateItemType[]) => {
  if (data.length === 0) {
    throw new Error("No items to create");
  }

  const parsed = ItemBaseSchema.array().safeParse(data);

  if (!parsed.success) {
    throw new Error(`Invalid input:\n ${parsed.error.message}`);
  }

  const restaurant = await getRestaurant(parsed.data[0].location);

  if (!restaurant) {
    throw new Error(
      `Restaurant at ${parsed.data[0].location} is not available`,
    );
  }

  const values = parsed.data.map(
    ({ name, location, cost, elapsedTime, image }) => ({
      name,
      location,
      cost,
      elapsedTime,
      image: typeof image === "string" && image.trim().length > 0 ? image : "",
    }),
  );

  try {
    return await db.insert(item).values(values).returning();
  } catch (err: any) {
    if (err.code === "23505") {
      throw new Error("ITEM_ALREADY_EXISTS");
    }

    throw new Error("DB_ERROR");
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

export const GetItems = async (restaurant: "america" | "india") => {
  try {
    const Items = await db.query.item.findMany({
      where: eq(item.location, restaurant),
    });
    return Items;
  } catch (err: any) {
    throw err;
  }
};

export const AddItemsByMenu = async (items: Map<string, string>) => {
  try {
    if (items.size < 1) {
      throw new Error("Not enough items to insert");
    }

    // Converts map to array of insertable rows
    const values = Array.from(items.entries()).map(([itemId, menuId]) => ({
      itemId,
      menuId,
    }));

    // Get item by ID
    const addedItems = await db
      .insert(menuItem)
      .values(values)
      .returning({ itemId: menuItem.itemId });

    return addedItems;
  } catch (err: any) {
    throw err;
  }
};

export const GetMenuItems = async (menuId: string) => {
  try {
    const MenuItems = await db.query.menuItem.findMany({
      where: eq(menuItem.menuId, menuId),
    });

    return MenuItems;
  } catch (err: any) {
    throw err;
  }
};

export const GetItemsByQuery = async (
  location: "america" | "india",
  query: string,
) => {
  try {
    if (!query.trim()) {
      return await db.query.item.findMany({
        where: eq(item.location, location),
      });
    }

    return await db.query.item.findMany({
      where: and(eq(item.location, location), ilike(item.name, `%${query}%`)),
    });
  } catch (err) {
    throw err;
  }
};

export const GetMenuItemsByQuery = async (
  location: "america" | "india",
  menuId: string,
  query: string,
) => {
  try {
    const conditions = [
      eq(menuItem.menuId, menuId),
      eq(item.location, location),
    ];

    if (query.trim()) {
      conditions.push(ilike(item.name, `%${query}%`));
    }

    const rows = await db
      .select({
        id: item.id,
        name: item.name,
        cost: item.cost,
        image: item.image,
        location: item.location,
        elapsedTime: item.elapsedTime,
      })
      .from(menuItem)
      .innerJoin(item, eq(menuItem.itemId, item.id))
      .where(and(...conditions));

    return rows;
  } catch (err) {
    throw err;
  }
};

export const GetMenuItemsByMenuId = async (menuId: string) => {
  try {
    const res = await db.query.menuItem.findMany({
      where: eq(menuItem.menuId, menuId),
      with: {
        item: true,
      },
    });
    return res;
  } catch (err: any) {
    throw err;
  }
};

export const DeleteMenuItemByMenuId = async (
  menuId: string,
  itemId: string,
) => {
  try {
    const result = await db
      .delete(menuItem)
      .where(and(eq(menuItem.menuId, menuId), eq(menuItem.itemId, itemId)))
      .returning();
    return result;
  } catch (err: any) {
    throw err;
  }
};

export const AddOrderItems = async (
  items: (CreateItemType & { quantity: number })[],
  customerName: string,
) => {
  try {
    const [createOrder] = await db
      .insert(order)
      .values({ customerName })
      .returning({ orderId: order.id });

    const orderItemsData = items.map((item) => ({
      orderId: createOrder?.orderId,
      itemId: item.id as string,
      quantity: item.quantity,
    }));

    await db.insert(orderItem).values(orderItemsData);
    return createOrder;
  } catch (err: any) {
    throw err;
  }
};

export const CreatePaymentMethod = async (data: CreatePaymentMethodType) => {
  try {
    const parsed = CreatePaymentMethodSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(`Invalid input:\n ${parsed.error.message}`);
    }

    const { image, name, isEnabled } = parsed.data;

    const imageUrl =
      typeof image === "string" && image.trim().length > 0 ? image : undefined;

    const [id] = await db
      .insert(paymentMethod)
      .values({ image: imageUrl, isEnabled, name })
      .returning({
        paymentId: paymentMethod.id,
      });

    return id;
  } catch (err: any) {
    throw err;
  }
};

export const GetPaymentMethods = async () => {
  try {
    const methods = db.query.paymentMethod.findMany();
    return methods;
  } catch (err: any) {
    throw err;
  }
};

export const TogglePaymentMethod = async (id: string, isEnabled: boolean) => {
  try {
    await db
      .update(paymentMethod)
      .set({ isEnabled })
      .where(eq(paymentMethod.id, id));

    return true;
  } catch (err) {
    throw new Error("Failed to update payment method");
  }
};
