
-- CreateTable
CREATE TABLE "ExternalEvaluation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "recipientName" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "senderUserId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "tokenExpiry" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ExternalEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalEvaluationResponse" (
    "id" TEXT NOT NULL,
    "externalEvaluationId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "mostValue" INTEGER NOT NULL,
    "leastValue" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExternalEvaluationResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalEvaluationResult" (
    "id" TEXT NOT NULL,
    "externalEvaluationId" TEXT NOT NULL,
    "personalityType" TEXT NOT NULL,
    "primaryStyle" TEXT NOT NULL,
    "secondaryStyle" TEXT,
    "styleIntensity" DOUBLE PRECISION NOT NULL,
    "percentileD" DOUBLE PRECISION NOT NULL,
    "percentileI" DOUBLE PRECISION NOT NULL,
    "percentileS" DOUBLE PRECISION NOT NULL,
    "percentileC" DOUBLE PRECISION NOT NULL,
    "isOvershift" BOOLEAN NOT NULL DEFAULT false,
    "isUndershift" BOOLEAN NOT NULL DEFAULT false,
    "isTightPattern" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExternalEvaluationResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExternalEvaluation_token_key" ON "ExternalEvaluation"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalEvaluationResult_externalEvaluationId_key" ON "ExternalEvaluationResult"("externalEvaluationId");

-- AddForeignKey
ALTER TABLE "ExternalEvaluation" ADD CONSTRAINT "ExternalEvaluation_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalEvaluationResponse" ADD CONSTRAINT "ExternalEvaluationResponse_externalEvaluationId_fkey" FOREIGN KEY ("externalEvaluationId") REFERENCES "ExternalEvaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalEvaluationResponse" ADD CONSTRAINT "ExternalEvaluationResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "DiscQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalEvaluationResult" ADD CONSTRAINT "ExternalEvaluationResult_externalEvaluationId_fkey" FOREIGN KEY ("externalEvaluationId") REFERENCES "ExternalEvaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
