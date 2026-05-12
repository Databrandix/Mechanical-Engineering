import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';
import GalleryGrid from '@/components/gallery/GalleryGrid';

export const metadata = {
  title: 'Gallery — Department of Mechanical Engineering',
  description:
    'Campus life moments from the Department of Mechanical Engineering, Sonargaon University.',
};

export default function GalleryPage() {
  return (
    <PageShell
      title="Photo Gallery"
      overline="Campus Life"
      image="/assets/mission-vision-hero.webp"
      imagePosition="center 3%"
      contentClassName="bg-gray-50 py-12 md:py-16"
    >
      <Container>
        <GalleryGrid />
      </Container>
    </PageShell>
  );
}
