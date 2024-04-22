ALTER TABLE "bookmark" DROP CONSTRAINT "bookmark_owner_id_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
