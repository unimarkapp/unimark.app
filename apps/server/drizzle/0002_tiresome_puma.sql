ALTER TABLE "bookmark" DROP CONSTRAINT "bookmark_collection_id_collection_id_fk";
ALTER TABLE "bookmark" DROP COLUMN IF EXISTS "collection_id";
DROP TABLE "collection";

