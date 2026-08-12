-- Service Charter — /student-society/service-charter
--
-- Three new tables, nothing altered. As with the layout plan migration,
-- the drift `migrate diff` reports on legal_pages_content is left alone.


-- CreateTable
CREATE TABLE "service_charter_section" (
    "id" TEXT NOT NULL,
    "serial" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "paragraphs" JSONB NOT NULL,
    "bullets" JSONB NOT NULL,
    "groups" JSONB NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_charter_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_standard" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "responsibleOffice" TEXT NOT NULL,
    "processingTime" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_standard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_charter_landing" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "intro" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "pdfFileName" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_charter_landing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "service_charter_section_displayOrder_idx" ON "service_charter_section"("displayOrder");

-- CreateIndex
CREATE INDEX "service_standard_displayOrder_idx" ON "service_standard"("displayOrder");

