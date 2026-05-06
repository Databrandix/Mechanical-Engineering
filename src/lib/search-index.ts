import { faculty } from './faculty-data';
import { news } from './news-data';
import { faqs } from './faq-data';
import { labs } from './labs-data';
import { clubs } from './clubs-data';
import { alumni } from './alumni-data';
import { researchPapers } from './research-data';
import { busRoutes } from './transport-data';
import { events } from './events-data';

export interface SearchItem {
  title: string;
  description?: string;
  href: string;
  type:
    | 'Page'
    | 'Faculty'
    | 'News'
    | 'FAQ'
    | 'Lab'
    | 'Club'
    | 'Alumni'
    | 'Research'
    | 'Transport'
    | 'Event';
}

const staticPages: SearchItem[] = [
  // About
  { title: 'Overview', type: 'Page', href: '/about/overview', description: 'Department overview and history' },
  { title: 'Message from Head', type: 'Page', href: '/about/message-from-head', description: "Head of Department's welcome message" },
  { title: "Dean's Message", type: 'Page', href: '/about/deans-message', description: "Dean's welcome message" },
  { title: 'Mission & Vision', type: 'Page', href: '/about/mission-vision', description: "Department's mission and long-term vision" },
  { title: 'Laboratory Facility', type: 'Page', href: '/about/laboratory-facility', description: 'Departmental labs and equipment' },
  { title: 'Lab Facility', type: 'Page', href: '/about/lab-facility', description: 'List of all departmental labs' },
  { title: 'Mecha Club', type: 'Page', href: '/about/mecha-club', description: 'Sonargaon University Mecha Club (SUMEC)' },

  // Faculty
  { title: 'Faculty Members', type: 'Page', href: '/faculty-member', description: 'List of all faculty members' },

  // Admission
  { title: 'Admission Requirements', type: 'Page', href: '/admission/requirements', description: 'Eligibility and requirements for admission' },
  { title: 'Tuition Fees', type: 'Page', href: '/admission/tuition-fees', description: 'Program tuition fees and payment schedule' },
  { title: 'Transfer Credits', type: 'Page', href: '/admission/transfer-credits', description: 'Credit transfer policy and procedure' },
  { title: 'Waiver & Scholarship', type: 'Page', href: '/admission/waiver-scholarship', description: 'Tuition waivers and merit scholarships' },
  { title: 'Admission Notice', type: 'Page', href: '/admission/notice', description: 'Current admission notice and deadlines' },
  { title: 'Prospectus', type: 'Page', href: '/admission/prospectus', description: 'Department prospectus' },

  // Student Society
  { title: 'Notice Board', type: 'Page', href: '/student-society/notice-board', description: 'Department notices and announcements' },
  { title: 'Events', type: 'Page', href: '/student-society/events', description: 'Department events and activities' },
  { title: 'Alumni', type: 'Page', href: '/student-society/alumni', description: 'Notable alumni from the department' },
  { title: 'FAQ', type: 'Page', href: '/student-society/faq', description: 'Frequently asked questions' },
  { title: 'Syllabus', type: 'Page', href: '/student-society/syllabus', description: 'Department syllabus and curriculum' },
  { title: 'Club List', type: 'Page', href: '/student-society/club-list', description: 'Student clubs and societies' },

  // Other
  { title: 'Research Publications', type: 'Page', href: '/research', description: 'Research papers and publications' },
  { title: 'News', type: 'Page', href: '/news', description: 'Latest news and updates' },
  { title: 'Transport Service', type: 'Page', href: '/transport-service', description: 'Free university bus service routes and timings' },
  { title: 'Contact Us', type: 'Page', href: '/contact', description: 'Get in touch — phone, email, campus addresses' },
];

const facultyItems: SearchItem[] = faculty.map((f) => ({
  title: f.name,
  description: [f.designation, f.secondaryTitle].filter(Boolean).join(' · '),
  href: `/faculty-member/${f.slug}`,
  type: 'Faculty',
}));

const newsItems: SearchItem[] = news.map((n) => ({
  title: n.title,
  description: n.summary,
  href: `/news/${n.slug}`,
  type: 'News',
}));

const faqItems: SearchItem[] = faqs.map((q) => ({
  title: q.question,
  description: q.answer,
  href: '/student-society/faq',
  type: 'FAQ',
}));

const labItems: SearchItem[] = labs.map((l) => ({
  title: l.name,
  description: l.tagline,
  href: `/about/lab-facility#${l.slug}`,
  type: 'Lab',
}));

const clubItems: SearchItem[] = clubs.map((c) => ({
  title: `${c.name} (${c.abbreviation})`,
  description: c.description,
  href: '/student-society/club-list',
  type: 'Club',
}));

const alumniItems: SearchItem[] = alumni.map((a) => ({
  title: a.name,
  description: `${a.designation} · ${a.company}`,
  href: '/student-society/alumni',
  type: 'Alumni',
}));

const researchItems: SearchItem[] = researchPapers.map((r) => ({
  title: r.title,
  description: r.authors,
  href: '/research',
  type: 'Research',
}));

const transportItems: SearchItem[] = busRoutes.map((r) => ({
  title: r.routeName,
  description: `Bus ${r.busNumber} · Contact ${r.contact}`,
  href: '/transport-service',
  type: 'Transport',
}));

const eventItems: SearchItem[] = events.map((e) => ({
  title: e.title,
  description: e.summary,
  href: `/student-society/events/${e.slug}`,
  type: 'Event',
}));

export const searchItems: SearchItem[] = [
  ...staticPages,
  ...facultyItems,
  ...newsItems,
  ...faqItems,
  ...labItems,
  ...clubItems,
  ...alumniItems,
  ...researchItems,
  ...transportItems,
  ...eventItems,
];

export function search(query: string, limit = 20): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  // Score: title match (3) > description match (1)
  const scored = searchItems
    .map((item) => {
      const title = item.title.toLowerCase();
      const desc = (item.description || '').toLowerCase();
      let score = 0;
      if (title.includes(q)) score += title.startsWith(q) ? 4 : 3;
      if (desc.includes(q)) score += 1;
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
  return scored;
}
