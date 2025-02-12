-- Custom SQL migration file, put your code below! --
-- Step 1: Add organization_id column to the tag table (nullable initially)
ALTER TABLE "tag" ADD COLUMN organization_id text;

-- Step 2: Set the default organization ID for existing rows
DO $$
DECLARE
    user_record RECORD;
    default_org_id TEXT;
BEGIN
    FOR user_record IN (SELECT id FROM "user") LOOP
        -- Get the default organization for the user
        SELECT o.id INTO default_org_id
        FROM organization o
        JOIN member m ON o.id = m.organization_id
        WHERE m.user_id = user_record.id AND o.slug = 'default';

        -- Update all tags for the user that don't have an organization_id set
        UPDATE tag
        SET organization_id = default_org_id
        WHERE owner_id = user_record.id AND organization_id IS NULL;
    END LOOP;
END $$;

-- Step 3: Add NOT NULL constraint to the organization_id column
ALTER TABLE "tag" ALTER COLUMN "organization_id" SET NOT NULL;
ALTER TABLE "tag" DROP CONSTRAINT "unique_name";
ALTER TABLE "tag" ADD CONSTRAINT "unique_name" UNIQUE("name","organization_id");