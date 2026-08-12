-- Links on a research paper
--
-- DOIs and article links live inside the citations the department supplies;
-- this is where they go once pulled out. Existing rows get an empty list.

-- AlterTable
ALTER TABLE "research_paper" ADD COLUMN     "links" JSONB NOT NULL DEFAULT '[]';
