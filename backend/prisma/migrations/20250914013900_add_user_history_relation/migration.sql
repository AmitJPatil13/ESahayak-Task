-- CreateIndex
CREATE INDEX "buyer_history_changedBy_idx" ON "buyer_history"("changedBy");

-- AddForeignKey
ALTER TABLE "buyer_history" ADD CONSTRAINT "buyer_history_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
