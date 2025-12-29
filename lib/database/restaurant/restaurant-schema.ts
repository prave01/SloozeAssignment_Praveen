import { pgTable, text, integer, pgEnum, uuid } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { userProfile } from "../auth/auth-schema";
import { primaryKey } from "drizzle-orm/pg-core";

export const locationEnum = pgEnum("location", ["america", "india"]);

export const restaurant = pgTable("restaurant", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
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
  name: text("name").notNull(),
  image: text("image"),
  cost: integer().default(0).notNull(),
  location: locationEnum().notNull(),
  elapsedTime: text("elapsedTime").notNull(),
});

export const menuItem = pgTable(
  "menu_item",
  {
    menuId: text("menuId")
      .notNull()
      .references(() => menu.id, { onDelete: "cascade" }),

    itemId: uuid("itemId")
      .notNull()
      .references(() => item.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.menuId, t.itemId] }),
  }),
);

export const restaurantRelations = relations(restaurant, ({ one, many }) => ({
  menu: one(menu),
  profile: many(userProfile),
}));

export const menuRelations = relations(menu, ({ one, many }) => ({
  restaurant: one(restaurant, {
    fields: [menu.restaurantId],
    references: [restaurant.id],
  }),
  items: many(item),
}));

export const itemRelations = relations(item, ({ many }) => ({
  menu: many(menu),
}));

export type RestaurantType = typeof restaurant.$inferInsert;

export const menuItemRelations = relations(menuItem, ({ one }) => ({
  menu: one(menu, {
    fields: [menuItem.menuId],
    references: [menu.id],
  }),
  item: one(item, {
    fields: [menuItem.itemId],
    references: [item.id],
  }),
}));
