CREATE TABLE IF NOT EXISTS "technical_question_templates" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "ownerUserId" TEXT NOT NULL,
  "basePositionId" TEXT NOT NULL,
  "basePositionTitle" TEXT NOT NULL,
  "questionSetConfig" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "technical_question_templates_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "selection_campaigns"
ADD COLUMN IF NOT EXISTS "technicalTemplateId" TEXT;

ALTER TABLE "external_technical_evaluations"
ADD COLUMN IF NOT EXISTS "technicalTemplateId" TEXT;

DO $$
BEGIN
  ALTER TABLE "technical_question_templates"
  ADD CONSTRAINT "technical_question_templates_ownerUserId_fkey"
  FOREIGN KEY ("ownerUserId") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "selection_campaigns"
  ADD CONSTRAINT "selection_campaigns_technicalTemplateId_fkey"
  FOREIGN KEY ("technicalTemplateId") REFERENCES "technical_question_templates"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "external_technical_evaluations"
  ADD CONSTRAINT "external_technical_evaluations_technicalTemplateId_fkey"
  FOREIGN KEY ("technicalTemplateId") REFERENCES "technical_question_templates"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS "technical_question_templates_ownerUserId_createdAt_idx"
  ON "technical_question_templates" ("ownerUserId", "createdAt");

CREATE INDEX IF NOT EXISTS "technical_question_templates_basePositionId_idx"
  ON "technical_question_templates" ("basePositionId");

CREATE INDEX IF NOT EXISTS "selection_campaigns_technicalTemplateId_idx"
  ON "selection_campaigns" ("technicalTemplateId");

CREATE INDEX IF NOT EXISTS "external_technical_evaluations_technicalTemplateId_idx"
  ON "external_technical_evaluations" ("technicalTemplateId");
