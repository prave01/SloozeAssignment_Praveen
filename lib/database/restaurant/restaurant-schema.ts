import {
  pgTable,
  text,
  integer,
  pgEnum,
  uuid,
  pgSequence,
  boolean,
} from "drizzle-orm/pg-core";
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
  name: text("name").unique().notNull(),
  image: text("image").notNull(),
  cost: integer().notNull(),
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

export const orderIdSequence = pgSequence("order_id_seq", {
  startWith: 1000,
  maxValue: 9999,
  minValue: 1000,
  cycle: false,
});

export const order = pgTable("order", {
  id: integer("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => sql`nextval('${orderIdSequence.seqName}')`),
  customerName: text("customerName").notNull(),
});

export const orderItem = pgTable(
  "order_item",
  {
    orderId: integer("orderId")
      .notNull()
      .references(() => order.id, { onDelete: "cascade" }),

    itemId: uuid("itemId")
      .notNull()
      .references(() => item.id, { onDelete: "cascade" }),
    quantity: integer().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.orderId, t.itemId] }),
  }),
);

export const paymentMethod = pgTable("payment_method", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  image: text("image"),
  isEnabled: boolean("is_enabled").default(true),
});

export const restaurantRelations = relations(restaurant, ({ one, many }) => ({
  menu: one(menu),
  profile: many(userProfile),
}));

export const menuRelations = relations(menu, ({ one, many }) => ({
  restaurant: one(restaurant, {
    fields: [menu.restaurantId],
    references: [restaurant.id],
  }),
  menuItems: many(menuItem),
}));

export const itemRelations = relations(item, ({ many }) => ({
  menuItems: many(menuItem),
  orderItems: many(orderItem),
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

export const orderRelations = relations(order, ({ many }) => ({
  orderItems: many(orderItem),
}));

export const orderItemRelations = relations(orderItem, ({ one }) => ({
  order: one(order, {
    fields: [orderItem.orderId],
    references: [order.id],
  }),
  item: one(item, {
    fields: [orderItem.itemId],
    references: [item.id],
  }),
}));
