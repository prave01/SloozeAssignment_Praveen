import { pgTable, text, integer, pgEnum, uuid } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const locationEnum = pgEnum("location", ["america", "india"]);

export const restaurant = pgTable("restaurant", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  location: locationEnum().notNull(),
});

export const menu = pgTable("menu", {
  id: text("id").primaryKey(),
  restaurantId: text("restaurantId")
    .notNull()
    .unique()
    .references(() => restaurant.id, { onDelete: "cascade" }),
});

export const item = pgTable("item", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  menuId: text("menuId")
    .notNull()
    .references(() => menu.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  imageUrl: text("imageUrl").notNull(),
  cost: integer().default(0).notNull(),
  elapsedTime: text("elapsedTime").notNull(),
});

export const restaurantRelations = relations(restaurant, ({ one }) => ({
  menu: one(menu),
}));

export const menuRelations = relations(menu, ({ one, many }) => ({
  restaurant: one(restaurant, {
    fields: [menu.restaurantId],
    references: [restaurant.id],
  }),
  items: many(item),
}));

export type RestaurantType = typeof restaurant.$inferInsert;
