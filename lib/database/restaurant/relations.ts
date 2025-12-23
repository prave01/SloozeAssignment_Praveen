import { restaurant, menu, item } from "./restaurant-schema";
import { relations } from "drizzle-orm";

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
