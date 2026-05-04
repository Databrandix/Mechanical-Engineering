import { Calendar } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';
import { news } from '@/lib/news-data';

export const metadata = {
  title: 'News — Department of Mechanical Engineering',
  description:
    'Latest news from the Department of Mechanical Engineering, Sonargaon University — events, workshops, industrial visits, and academic milestones.',
};

export default function NewsListingPage() {
  return (
    <PageShell title="Latest News" overline="News" contentClassName="bg-gray-50 py-12 md:py-20">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-12">
          <p className="text-base md:text-lg text-gray-700 leading-[1.85]">
            Stay updated with the recent breakthroughs, campus highlights, and academic achievements from the heart of our community.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <a
              key={item.slug}
              href={`/news/${item.slug}`}
              className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-emerald-600 text-xs font-semibold">{item.category}</span>
                </div>
                <h3 className="font-display text-base md:text-lg font-bold text-primary leading-snug mb-2 group-hover:text-accent transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                  {item.summary}
                </p>
                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={13} className="text-accent" />
                  {item.date}
                </div>
              </div>
            </a>
          ))}
        </div>
      </Container>
    </PageShell>
  );
}
