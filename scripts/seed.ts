import { db } from "../lib/database/drizzle";
import { user, userProfile, restaurant, menu } from "../lib/database";
import { auth } from "../lib/auth/auth";
import { v7 } from "uuid";
import * as dotenv from "dotenv";

dotenv.config();

async function seed() {
  console.log("Seeding database...");

  try {
    // 1. Create Restaurants
    console.log("Creating restaurants...");
    const [indiaRest] = await db
      .insert(restaurant)
      .values({
        id: v7(),
        name: "Slooze India",
        location: "india",
      })
      .onConflictDoNothing()
      .returning();

    const [americaRest] = await db
      .insert(restaurant)
      .values({
        id: v7(),
        name: "Slooze America",
        location: "america",
      })
      .onConflictDoNothing()
      .returning();

    // 2. Create Menus
    console.log("Creating menus...");
    if (indiaRest) {
      await db
        .insert(menu)
        .values({ id: v7(), restaurantId: indiaRest.id })
        .onConflictDoNothing();
    }
    if (americaRest) {
      await db
        .insert(menu)
        .values({ id: v7(), restaurantId: americaRest.id })
        .onConflictDoNothing();
    }

    // 3. Create Users
    const usersToCreate = [
      {
        name: "Nick Admin",
        email: "nick@example.com",
        password: "password123",
        role: "admin" as const,
        location: "both" as const,
      },
      {
        name: "John Manager",
        email: "manager@example.com",
        password: "password123",
        role: "manager" as const,
        location: "india" as const,
      },
      {
        name: "Jane Member",
        email: "member@example.com",
        password: "password123",
        role: "member" as const,
        location: "america" as const,
      },
    ];

    for (const u of usersToCreate) {
      console.log(`Creating user: ${u.email}...`);

      // Use better-auth API to create user (handles hashing)
      const res = await auth.api.signUpEmail({
        body: {
          email: u.email,
          password: u.password,
          name: u.name,
        },
      });

      if (res.user) {
        let restaurantID = null;
        if (u.location === "india" && indiaRest) restaurantID = indiaRest.id;
        if (u.location === "america" && americaRest)
          restaurantID = americaRest.id;

        await db
          .insert(userProfile)
          .values({
            userId: res.user.id,
            role: u.roleed
            location: u.location,
            restaurantID,
          })
          .onConflictDoNothing();
      }
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
