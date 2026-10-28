-- AlterTable: bind WhatsApp + business story to Clerk userId
ALTER TABLE "whatsapp_sessions" ADD COLUMN IF NOT EXISTS "user_id" VARCHAR(255);
ALTER TABLE "business_stories" ADD COLUMN IF NOT EXISTS "user_id" VARCHAR(255);

-- Backfill from organization memberships (owner/first member)
UPDATE "whatsapp_sessions" ws
SET "user_id" = m."user_id"
FROM (
  SELECT DISTINCT ON ("organization_id") "organization_id", "user_id"
  FROM "organization_memberships"
  ORDER BY "organization_id", "id" ASC
) m
WHERE ws."organization_id" = m."organization_id"
  AND (ws."user_id" IS NULL OR ws."user_id" = '');

UPDATE "business_stories" bs
SET "user_id" = m."user_id"
FROM (
  SELECT DISTINCT ON ("organization_id") "organization_id", "user_id"
  FROM "organization_memberships"
  ORDER BY "organization_id", "id" ASC
) m
WHERE bs."organization_id" = m."organization_id"
  AND (bs."user_id" IS NULL OR bs."user_id" = '');

-- Drop rows that still have no user (cannot satisfy NOT NULL / FK)
DELETE FROM "whatsapp_sessions" WHERE "user_id" IS NULL OR "user_id" = '';
DELETE FROM "business_stories" WHERE "user_id" IS NULL OR "user_id" = '';

ALTER TABLE "whatsapp_sessions" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "business_stories" ALTER COLUMN "user_id" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "whatsapp_sessions_user_id_key" ON "whatsapp_sessions"("user_id");
CREATE UNIQUE INDEX IF NOT EXISTS "business_stories_user_id_key" ON "business_stories"("user_id");

DO $$ BEGIN
  ALTER TABLE "whatsapp_sessions"
    ADD CONSTRAINT "whatsapp_sessions_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "business_stories"
    ADD CONSTRAINT "business_stories_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
