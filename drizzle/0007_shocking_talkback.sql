ALTER TABLE "tag" DROP CONSTRAINT "unique_name";--> statement-breakpoint
ALTER TABLE "tag" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "tag" ADD CONSTRAINT "unique_name" UNIQUE("name","organization_id");