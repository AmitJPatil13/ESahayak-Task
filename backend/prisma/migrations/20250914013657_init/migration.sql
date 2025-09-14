-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "buyer_history_buyerId_idx" ON "buyer_history"("buyerId");

-- CreateIndex
CREATE INDEX "buyer_history_changedAt_idx" ON "buyer_history"("changedAt");

-- CreateIndex
CREATE INDEX "buyers_ownerId_idx" ON "buyers"("ownerId");

-- CreateIndex
CREATE INDEX "buyers_status_idx" ON "buyers"("status");

-- CreateIndex
CREATE INDEX "buyers_city_idx" ON "buyers"("city");

-- CreateIndex
CREATE INDEX "buyers_propertyType_idx" ON "buyers"("propertyType");

-- CreateIndex
CREATE INDEX "buyers_createdAt_idx" ON "buyers"("createdAt");

-- CreateIndex
CREATE INDEX "buyers_updatedAt_idx" ON "buyers"("updatedAt");
