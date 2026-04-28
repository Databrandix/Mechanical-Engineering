import HeroSection from '@/components/sections/HeroSection';
import OverviewSection from '@/components/sections/OverviewSection';
import ProgramsSection from '@/components/sections/ProgramsSection';
import QuickLinksSection from '@/components/sections/QuickLinksSection';
import NoticesSection from '@/components/sections/NoticesSection';
import ResearchLabsSection from '@/components/sections/ResearchLabsSection';
import MajorResearchSection from '@/components/sections/MajorResearchSection';
import EventsSection from '@/components/sections/EventsSection';
import NewsSection from '@/components/sections/NewsSection';
import ServicesSection from '@/components/sections/ServicesSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <OverviewSection />
      <ProgramsSection />
      <QuickLinksSection />
      <NoticesSection />
      <ResearchLabsSection />
      <MajorResearchSection />
      <EventsSection />
      <NewsSection />
      <ServicesSection />
    </>
  );
}
