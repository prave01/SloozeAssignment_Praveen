"use server";

import { restaurant } from "@/lib/database";
import { db } from "@/lib/database/drizzle";
import { v7 } from "uuid";

// Create restaurant in any location
export const createRestaurant = async (
  name: string,
  location: "india" | "america",
) => {
  try {
    console.log("Running in server");
    const res = await db.insert(restaurant).values({
      id: v7(),
      name,
      location,
    });
    console.log(res);
  } catch (err: any) {
    return Error("Error while creating restaurant:\n", err);
  }
};
