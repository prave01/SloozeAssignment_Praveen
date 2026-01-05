CREATE TYPE "public"."order_status" AS ENUM('pending', 'completed', 'cancelled');--> statement-breakpoint
CREATE SEQUENCE "public"."order_id_seq" INCREMENT BY 1 MINVALUE 1000 MAXVALUE 9999 START WITH 1000 CACHE 1;--> statement-breakpoint
CREATE TABLE "user_profile" (
	"user_id" text PRIMARY KEY NOT NULL,
	"role" "role" NOT NULL,
	"location" "location" NOT NULL,
	"restaurant_id" text
);
--> statement-breakpoint
CREATE TABLE "menu_item" (
	"menuId" text NOT NULL,
	"itemId" uuid NOT NULL,
	CONSTRAINT "menu_item_menuId_itemId_pk" PRIMARY KEY("menuId","itemId")
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" integer PRIMARY KEY NOT NULL,
	"customerName" text NOT NULL,
	"userId" text,
	"location" "location" NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"total" integer NOT NULL,
	"paymentMethodId" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_item" (
	"orderId" integer NOT NULL,
	"itemId" uuid NOT NULL,
	"quantity" integer NOT NULL,
	CONSTRAINT "order_item_orderId_itemId_pk" PRIMARY KEY("orderId","itemId")
);
--> statement-breakpoint
CREATE TABLE "payment_method" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"image" text,
	"is_enabled" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "item" DROP CONSTRAINT "item_menuId_menu_id_fk";
--> statement-breakpoint
ALTER TABLE "user_profile" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."role";--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'manager', 'member');--> statement-breakpoint
ALTER TABLE "user_profile" ALTER COLUMN "role" SET DATA TYPE "public"."role" USING "role"::"public"."role";--> statement-breakpoint
ALTER TABLE "item" ALTER COLUMN "cost" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "item" ADD COLUMN "image" text NOT NULL;--> statement-breakpoint
ALTER TABLE "item" ADD COLUMN "location" "location" NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_restaurant_id_restaurant_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_item" ADD CONSTRAINT "menu_item_menuId_menu_id_fk" FOREIGN KEY ("menuId") REFERENCES "public"."menu"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_item" ADD CONSTRAINT "menu_item_itemId_item_id_fk" FOREIGN KEY ("itemId") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_paymentMethodId_payment_method_id_fk" FOREIGN KEY ("paymentMethodId") REFERENCES "public"."payment_method"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_orderId_order_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_itemId_item_id_fk" FOREIGN KEY ("itemId") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "role";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "location";--> statement-breakpoint
ALTER TABLE "item" DROP COLUMN "menuId";--> statement-breakpoint
ALTER TABLE "item" DROP COLUMN "imageUrl";--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "restaurant" ADD CONSTRAINT "restaurant_name_unique" UNIQUE("name");