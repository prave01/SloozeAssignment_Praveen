CREATE TYPE "public"."role" AS ENUM('Admin', 'Manager', 'Member');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "role" NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "location" "role" NOT NULL;