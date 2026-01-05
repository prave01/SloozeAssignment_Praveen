"use server";

import {
  item,
  menu,
  menuItem,
  order,
  orderItem,
  paymentMethod,
  restaurant,
  user,
  userProfile,
  type RestaurantType,
} from "@/lib/database";
import { and, eq, ilike, ne, or, type SQL } from "drizzle-orm";
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
import { headers } from "next/headers";

const validateUserAccess = async (requestedLocation?: "america" | "india") => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session || !session?.user) {
    throw new Error("You are not authenticated");
  }

  const [user] = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, session.user.id));

  if (!user) {
    throw new Error("User profile not found");
  }

  if (user.role === "admin") {
    return user;
  }

  if (requestedLocation && user.location !== "both" && user.location !== requestedLocation) {
    throw new Error("You do not have access to this location");
  }

  return user;
};

export const getUserProfile = async () => {
  const user = await validateUserAccess();
  return user;
};

// Create restaurant in any location
export const createRestaurant = async ({
  name,
  location,
}: CreateRestaurant) => {
  await validateUserAccess(location);

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
  await validateUserAccess(location);

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
  await validateUserAccess(location);

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

  await validateUserAccess(data[0].location);

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session) {
    throw new Error("You are not authenticated");
  }

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
  const user = await validateUserAccess();
  if (user.role !== "admin") {
    throw new Error("Only admins can create users");
  }
  try {
    const parsed = CreateUserSchema.safeParse(data);

    if (!parsed.success) {
      throw new Error(`Invalid input:\n ${parsed.error.message}`);
    }

    const { name, location, password, role, email, image } = parsed.data;

    let restaurantID = null;
    if (location !== "both") {
      const restaurantData = await getRestaurant(location);
      restaurantID = restaurantData.id;
    }

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
  await validateUserAccess(restaurant);

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session) {
    throw new Error("You are not authenticated");
  }

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session) {
    throw new Error("You are not authenticated");
  }

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session) {
    throw new Error("You are not authenticated");
  }

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session) {
    throw new Error("You are not authenticated");
  }

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session) {
    throw new Error("You are not authenticated");
  }

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session) {
    throw new Error("You are not authenticated");
  }

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

export const DeleteAvailableItem = async (itemId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session) {
    throw new Error("You are not authenticated");
  }

  try {
    const result = await db.delete(item).where(eq(item.id, itemId)).returning();
    return result;
  } catch (err: any) {
    throw err;
  }
};

export const AddOrderItems = async (
  items: (CreateItemType & { quantity: number })[],
  customerName: string,
  location: "america" | "india",
  total: number,
  paymentMethodId?: string,
  userId?: string,
) => {
  const user = await validateUserAccess(location);

  if (user.role === "member" && paymentMethodId) {
    throw new Error("Members cannot place orders (checkout & pay).");
  }

  try {
    if (items.length === 0) {
      throw new Error("No items to add to order");
    }

    const [createOrder] = await db
      .insert(order)
      .values({
        customerName,
        location,
        total,
        paymentMethodId: paymentMethodId || null,
        userId: userId || null,
      })
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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session) {
    throw new Error("You are not authenticated");
  }

  try {
    const parsed = CreatePaymentMethodSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(`Invalid input:\n ${parsed.error.message}`);
    }

    const { image, name, isEnabled, location } = parsed.data;

    const imageUrl =
      typeof image === "string" && image.trim().length > 0 ? image : undefined;

    const [id] = await db
      .insert(paymentMethod)
      .values({ image: imageUrl, isEnabled, name, location })
      .returning({
        paymentId: paymentMethod.id,
      });

    return id;
  } catch (err: any) {
    throw err;
  }
};

export const GetPaymentMethods = async (location?: "america" | "india") => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session) {
    throw new Error("You are not authenticated");
  }

  try {
    const whereClause = location ? eq(paymentMethod.location, location) : undefined;
    const methods = await db.query.paymentMethod.findMany({
      where: whereClause,
    });
    return methods;
  } catch (err: any) {
    throw err;
  }
};

export const TogglePaymentMethod = async (id: string, isEnabled: boolean) => {
  const user = await validateUserAccess();

  if (user.role !== "admin") {
    throw new Error("Only admins can update payment methods");
  }

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

export const GetOrders = async (locationFilter?: "america" | "india") => {
  const user = await validateUserAccess(locationFilter);

  try {
    let whereClause;
    if (user.role !== "admin") {
      // Enforce user's location
      whereClause = eq(order.location, user.location as "america" | "india");
    } else if (locationFilter) {
      // Admin requested specific location
      whereClause = eq(order.location, locationFilter);
    }

    const orders = await db.query.order.findMany({
      where: whereClause,
      with: {
        orderItems: {
          with: {
            item: true,
          },
        },
        paymentMethod: true,
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: (order, { desc: descFn }) => [descFn(order.createdAt)],
    });

    return orders;
  } catch (err: any) {
    throw new Error("Failed to fetch orders");
  }
};

export const CancelOrder = async (orderId: number) => {
  const user = await validateUserAccess();

  if (user.role === "member") {
    throw new Error("Members cannot cancel orders");
  }

  try {
    const [updatedOrder] = await db
      .update(order)
      .set({ status: "cancelled" })
      .where(eq(order.id, orderId))
      .returning();

    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    return updatedOrder;
  } catch (err: any) {
    throw new Error(err?.message || "Failed to cancel order");
  }
};

export const CompleteOrder = async (orderId: number) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session) {
    throw new Error("You are not authenticated");
  }

  try {
    const [updatedOrder] = await db
      .update(order)
      .set({ status: "completed" })
      .where(eq(order.id, orderId))
      .returning();

    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    return updatedOrder;
  } catch (err: any) {
    throw new Error(err?.message || "Failed to complete order");
  }
};

export const GetAllUsers = async (locationFilter?: "america" | "india") => {
  const admin = await validateUserAccess();
  if (admin.role !== "admin") {
    throw new Error("Only admins can access user management");
  }

  try {
    const conditions: SQL[] = [ne(user.id, admin.userId)];

    if (locationFilter) {
      // Show users assigned to the selected location OR assigned to 'both'
      const locOrBoth = or(
        eq(userProfile.location, locationFilter),
        eq(userProfile.location, "both"),
      );
      if (locOrBoth) conditions.push(locOrBoth);
    }

    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        profile: {
          role: userProfile.role,
          location: userProfile.location,
        },
      })
      .from(user)
      .innerJoin(userProfile, eq(user.id, userProfile.userId))
      .where(and(...conditions));

    return users;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch users");
  }
};

export const UpdateUser = async (
  userId: string,
  data: {
    name: string;
    email: string;
    role: "admin" | "manager" | "member";
    location: "america" | "india" | "both";
  },
) => {
  const admin = await validateUserAccess();
  if (admin.role !== "admin") {
    throw new Error("Only admins can update users");
  }

  try {
    await db
      .update(user)
      .set({ name: data.name, email: data.email })
      .where(eq(user.id, userId));
    await db
      .update(userProfile)
      .set({ role: data.role, location: data.location })
      .where(eq(userProfile.userId, userId));
    return true;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update user");
  }
};

export const DeleteUser = async (userId: string) => {
  const admin = await validateUserAccess();
  if (admin.role !== "admin") {
    throw new Error("Only admins can delete users");
  }

  try {
    await db.delete(user).where(eq(user.id, userId));
    return true;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to delete user");
  }
};
