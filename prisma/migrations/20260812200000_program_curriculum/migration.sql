-- Course curriculum — /programs/[slug]
--
-- One new table. As with the previous two migrations, the drift
-- `migrate diff` reports on legal_pages_content is left alone.


-- CreateTable
CREATE TABLE "program_curriculum" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "semesters" JSONB NOT NULL,
    "creditRows" JSONB NOT NULL,
    "pdfUrl" TEXT,
    "pdfFileName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "program_curriculum_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "program_curriculum_programId_key" ON "program_curriculum"("programId");

-- AddForeignKey
ALTER TABLE "program_curriculum" ADD CONSTRAINT "program_curriculum_programId_fkey" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

