-- Custom SQL migration file, put your code below! --
-- Step 1: Add organization_id column to the tag table (nullable initially)
ALTER TABLE bookmark ADD COLUMN organization_id text;
-- Step 2: Check all users if they don't have organizations, then create one with slug: 'default'
DO $$
DECLARE
    user_record RECORD;
    default_org_id TEXT;
BEGIN
    FOR user_record IN (SELECT id FROM "user") LOOP
        -- Check if the user has any organizations
        IF NOT EXISTS (SELECT 1 FROM member WHERE user_id = user_record.id) THEN
            -- Create a default organization for the user
            INSERT INTO organization (id, name, slug, "default", created_at)
            VALUES (gen_random_uuid(), 'Personal', 'personal', TRUE, NOW())
            RETURNING id INTO default_org_id;

            -- Step 2: Insert row in member table with organization_id, user_id, role - owner
            INSERT INTO member (id, organization_id, user_id, role, created_at)
            VALUES (gen_random_uuid(), default_org_id, user_record.id, 'owner', NOW());
        END IF;
    END LOOP;
END $$;

-- Step 4: Check all user's bookmarks if organization_id is empty, then get the default organization of the user (from step 1) and set it for each bookmark
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
        WHERE m.user_id = user_record.id AND o."default" = TRUE;

        -- Update all bookmarks for the user that don't have an organization_id set
        UPDATE bookmark
        SET organization_id = default_org_id
        WHERE owner_id = user_record.id AND organization_id IS NULL;
    END LOOP;
END $$;

-- Step 5: Add NOT NULL constraint to the organization_id column
ALTER TABLE bookmark ALTER COLUMN organization_id SET NOT NULL;