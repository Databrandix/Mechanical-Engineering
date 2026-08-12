import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';
import {
  getDepartmentIdentity,
  getDepartmentLayouts,
  getOfficeLocations,
  getPageHero,
} from '@/lib/identity';
import LayoutPlanDocument from './LayoutPlanDocument';
import RoomDirectory from './RoomDirectory';

export const metadata = {
  title: 'Layout Plan — Department of Mechanical Engineering',
  description:
    'Where each office, classroom and laboratory of the Department of Mechanical Engineering sits, and in which building.',
};

export default async function LayoutPlanPage() {
  const [items, rooms, dept, hero] = await Promise.all([
    getDepartmentLayouts(),
    getOfficeLocations(),
    getDepartmentIdentity(),
    getPageHero('about-layout-plan'),
  ]);

  const documents = items
    .filter((i) => i.pdfUrl)
    .map((i) => ({
      slug: i.slug,
      title: i.title,
      shortTitle: i.shortTitle,
      cover: i.coverUrl,
      pdf: i.pdfUrl as string,
    }));

  return (
    <PageShell
      title={hero?.heroTitle ?? 'Layout Plan'}
      subtitle={hero?.heroSubtitle ?? undefined}
      overline={hero?.heroOverline ?? 'About'}
      image={hero?.heroImageUrl ?? undefined}
      imagePosition={hero ? `center ${hero.heroImageVerticalPercent}%` : undefined}
      contentClassName="bg-gray-50 py-12 md:py-20"
    >
      <Container>
        {/* The table first: someone on this page is usually looking for a room
            number, and reads it here rather than downloading a file to find
            it. The plan below is the same information to take away. */}
        <RoomDirectory rooms={rooms} departmentName={dept.name} />

        {documents.length > 0 && (
          <div className="mt-14 md:mt-20">
            <h2 className="font-display mb-2 text-center text-xl font-bold text-primary md:text-2xl">
              Straight from the department
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-center text-[15px] text-gray-600">
              The layout plan as issued — every room and the building it is in.
            </p>
            <LayoutPlanDocument items={documents} />
          </div>
        )}

        {documents.length === 0 && rooms.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-gray-500">The layout plan will be published soon.</p>
          </div>
        )}
      </Container>
    </PageShell>
  );
}
