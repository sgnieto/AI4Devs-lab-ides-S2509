-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "address" TEXT,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "cvPath" TEXT,
ADD COLUMN     "education" TEXT,
ADD COLUMN     "workExperience" TEXT;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
