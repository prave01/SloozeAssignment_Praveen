CREATE TYPE "public"."location" AS ENUM('america', 'india');--> statement-breakpoint
CREATE TABLE "item" (
	"id" text PRIMARY KEY NOT NULL,
	"menuId" text NOT NULL,
	"name" text NOT NULL,
	"imageUrl" text NOT NULL,
	"cost" integer DEFAULT 0 NOT NULL,
	"elapsedTime" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menu" (
	"id" text PRIMARY KEY NOT NULL,
	"restaurantId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "restaurant" (
	"id" text PRIMARY KEY NOT NULL,
	"location" "location"
);
--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_menuId_menu_id_fk" FOREIGN KEY ("menuId") REFERENCES "public"."menu"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu" ADD CONSTRAINT "menu_restaurantId_restaurant_id_fk" FOREIGN KEY ("restaurantId") REFERENCES "public"."restaurant"("id") ON DELETE cascade ON UPDATE no action;