ALTER TABLE "selection_campaigns"
ADD COLUMN IF NOT EXISTS "campaignType" TEXT NOT NULL DEFAULT 'SELECTION';

UPDATE "selection_campaigns"
SET "campaignType" = 'SELECTION'
WHERE "campaignType" IS NULL;
