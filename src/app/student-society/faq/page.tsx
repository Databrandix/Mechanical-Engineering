import PageShell from '@/components/layout/PageShell';
import FAQList from './FAQList';

export const metadata = {
  title: 'FAQ — Department of Mechanical Engineering',
  description:
    'Frequently asked questions about admission, rankings, campus, programs, and exams at Sonargaon University.',
};

export default function FAQPage() {
  return (
    <PageShell
      title="Frequently Asked Questions"
      overline="Student Society"
      contentClassName="bg-gray-50 py-12 md:py-16"
    >
      <div className="mx-auto max-w-[1400px]">
        <FAQList />
      </div>
    </PageShell>
  );
}
