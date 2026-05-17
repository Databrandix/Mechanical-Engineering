import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';
import { getFaqs } from '@/lib/identity';
import FAQList from './FAQList';

export const metadata = {
  title: 'FAQ — Department of Mechanical Engineering',
  description:
    'Frequently asked questions about admission, rankings, campus, programs, and exams at Sonargaon University.',
};

export default async function FAQPage() {
  const faqs = await getFaqs();

  return (
    <PageShell
      title="Frequently Asked Questions"
      overline="Student Society"
      image="/assets/faq-hero.webp"
      imagePosition="center 35%"
      contentClassName="bg-gray-50 py-12 md:py-16"
    >
      <Container>
        <div className="mx-auto max-w-[1400px]">
          <FAQList
            faqs={faqs.map((f) => ({
              id:       f.id,
              category: f.category,
              question: f.question,
              answer:   f.answer,
            }))}
          />
        </div>
      </Container>
    </PageShell>
  );
}
