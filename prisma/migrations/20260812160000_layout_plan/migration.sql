-- Layout Plan — /about/layout-plan
--
-- Two new tables, nothing altered. `prisma migrate diff` also proposed
-- dropping two defaults on legal_pages_content; that is drift between the
-- live database and the schema which predates this work, so it is left
-- alone rather than folded into an unrelated migration.

-- CreateTable
CREATE TABLE "office_location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "building" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "office_location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department_layout" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortTitle" TEXT NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "coverPublicId" TEXT,
    "pdfUrl" TEXT,
    "pdfPublicId" TEXT,
    "pdfFileName" TEXT,
    "displayOrder" INTEGER NOT NULL,

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "department_layout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "office_location_displayOrder_idx" ON "office_location"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "department_layout_slug_key" ON "department_layout"("slug");

-- CreateIndex
CREATE INDEX "department_layout_displayOrder_idx" ON "department_layout"("displayOrder");
