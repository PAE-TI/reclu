-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('PAYPAL', 'STRIPE');

-- AlterTable
ALTER TABLE "credit_purchases"
ADD COLUMN     "paymentProvider" "PaymentProvider" NOT NULL DEFAULT 'PAYPAL',
ADD COLUMN     "stripeCheckoutSessionId" TEXT,
ADD COLUMN     "stripePaymentIntentId" TEXT,
ADD COLUMN     "stripeCustomerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "credit_purchases_stripeCheckoutSessionId_key" ON "credit_purchases"("stripeCheckoutSessionId");

-- CreateIndex
CREATE INDEX "credit_purchases_paymentProvider_status_idx" ON "credit_purchases"("paymentProvider", "status");
