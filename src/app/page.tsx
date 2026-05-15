import dynamic from 'next/dynamic';
import HeroSection from '@/components/sections/HeroSection';
import { getDepartmentIdentity, getPrograms, getResearchAreas } from '@/lib/identity';

function sectionSkeleton(minHeight: string) {
  return function Skeleton() {
    return <div className={`${minHeight} bg-white`} aria-hidden="true" />;
  };
}

const OverviewSection = dynamic(() => import('@/components/sections/OverviewSection'), {
  loading: sectionSkeleton('min-h-[500px]'),
});
const ProgramsSection = dynamic(() => import('@/components/sections/ProgramsSection'), {
  loading: sectionSkeleton('min-h-[500px]'),
});
const QuickLinksSection = dynamic(() => import('@/components/sections/QuickLinksSection'), {
  loading: sectionSkeleton('min-h-[300px]'),
});
const NoticesSection = dynamic(() => import('@/components/sections/NoticesSection'), {
  loading: sectionSkeleton('min-h-[400px]'),
});
const ResearchLabsSection = dynamic(() => import('@/components/sections/ResearchLabsSection'), {
  loading: sectionSkeleton('min-h-[500px]'),
});
const MajorResearchSection = dynamic(() => import('@/components/sections/MajorResearchSection'), {
  loading: sectionSkeleton('min-h-[500px]'),
});
const EventsSection = dynamic(() => import('@/components/sections/EventsSection'), {
  loading: sectionSkeleton('min-h-[500px]'),
});
const NewsSection = dynamic(() => import('@/components/sections/NewsSection'), {
  loading: sectionSkeleton('min-h-[500px]'),
});
const ServicesSection = dynamic(() => import('@/components/sections/ServicesSection'), {
  loading: sectionSkeleton('min-h-[400px]'),
});

export default async function HomePage() {
  const [dept, programs, researchAreas] = await Promise.all([
    getDepartmentIdentity(),
    getPrograms(),
    getResearchAreas(),
  ]);
  return (
    <>
      <HeroSection
        imageUrls={[dept.heroImage1Url, dept.heroImage2Url, dept.heroImage3Url]}
        breadcrumbLabel={dept.breadcrumbLabel}
      />
      <OverviewSection />
      <ProgramsSection programs={programs} />
      <QuickLinksSection />
      <NoticesSection />
      <ResearchLabsSection />
      <MajorResearchSection areas={researchAreas} />
      <EventsSection />
      <NewsSection />
      <ServicesSection />
    </>
  );
}
