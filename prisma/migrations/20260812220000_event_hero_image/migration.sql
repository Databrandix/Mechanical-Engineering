-- Event hero banner
--
-- Three columns added to event, nothing altered. As with the previous
-- migrations, the drift `migrate diff` reports on legal_pages_content is
-- left alone. Existing rows get heroImageUrl NULL, which the page reads as
-- "use the card cover" — so nothing changes visually until a banner is set.

-- AlterTable
ALTER TABLE "event" ADD COLUMN     "heroImagePublicId" TEXT,
ADD COLUMN     "heroImageUrl" TEXT,
ADD COLUMN     "heroImageVerticalPercent" INTEGER NOT NULL DEFAULT 50;
