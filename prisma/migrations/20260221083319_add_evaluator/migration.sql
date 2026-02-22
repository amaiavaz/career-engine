-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "evaluatorId" TEXT;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_evaluatorId_fkey" FOREIGN KEY ("evaluatorId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
