export const programs: {
  id: string;
  title: string;
  subtitle?: string;
  duration?: string;
  description: string;
  image: string;
  specializations?: string[];
  cta: string;
}[] = [
  {
    id: 'undergrad',
    title: 'Undergraduate',
    subtitle: 'B.Sc in Mechanical Engineering',
    duration: '4 Years · 8 Semesters',
    description: 'Our flagship undergraduate program builds a strong foundation in core mechanical engineering — combining rigorous theory, modern lab practice, and design projects that prepare graduates for industry, research, and global postgraduate study.',
    image: '/assets/site-school-1024x576.webp',
    specializations: [
      'Thermal Engineering',
      'Design & Manufacturing',
      'Robotics & Automation',
      'Energy Systems',
    ],
    cta: 'View More',
  },
];

export const quickLinks: { name: string; href: string; external?: boolean; disabled?: boolean }[] = [
  { name: 'Admission Requirements', href: '/admission/requirements' },
  { name: 'Tuition Fees', href: '/admission/tuition-fees' },
  { name: 'Transfer Credits', href: '/admission/transfer-credits' },
  { name: 'Waiver & Scholarship', href: '/admission/waiver-scholarship' },
  { name: 'Student Portal', href: '#', disabled: true },
  { name: 'e-Learn', href: '#', disabled: true },
  { name: 'Library', href: 'http://lib.su.edu.bd', external: true },
];

export const notices = [
  { date: '13 Apr, 2026', title: 'Specialization/Major Selection Process, 64 Batch [Mandatory]' },
  { date: '7 Apr, 2026', title: 'Notice on Teaching Evaluation for Spring Semester of 2026 under Trimester System' },
  { date: '2 Apr, 2026', title: 'Fees Payment Schedule of Spring 2026 Final Examination' },
  { date: '5 Mar, 2026', title: 'Notice on Shab-E-Qadr and Holy Eid-al-Fitr 2026' },
  { date: '22 Feb, 2026', title: 'Midterm Examination Seat Plan [Spring-2026]' }
];

export const labs = [
  { id: 'workshop', name: 'Mechanical Workshop', location: 'Room No- ME 101, ME Building', image: 'https://picsum.photos/seed/lab1/800/600' },
  { id: 'heat-lab', name: 'Heat Transfer & Thermodynamics Lab', location: 'Room No- ME 203, ME Building', image: 'https://picsum.photos/seed/lab2/800/600' },
  { id: 'cad-lab', name: 'CAD/CAM & Simulation Lab', location: 'Room No- 502, Knowledge Tower', image: 'https://picsum.photos/seed/lab3/800/600' },
  { id: 'robotics-lab', name: 'Robotics & Automation Lab', location: '203 (B) Knowledge Tower, Savar', image: 'https://picsum.photos/seed/lab4/800/600' },
  { id: 'fluid-lab', name: 'Fluid Mechanics & Hydraulics Lab', location: 'Room No- ME 105, ME Building', image: 'https://picsum.photos/seed/lab5/800/600' },
  { id: 'materials-lab', name: 'Materials Testing Lab', location: 'Room No- ME 207, ME Building', image: 'https://picsum.photos/seed/lab6/800/600' },
  { id: 'manufacturing-lab', name: 'Manufacturing Process Lab', location: 'Room No- ME 109, ME Building', image: 'https://picsum.photos/seed/lab7/800/600' },
  { id: 'engine-lab', name: 'Engine & Automotive Lab', location: 'Room No- ME 112, ME Building', image: 'https://picsum.photos/seed/lab8/800/600' }
];

export const researchAreas = [
  { name: 'Thermodynamics & Heat Transfer', icon: 'Flame' },
  { name: 'Fluid Mechanics & CFD', icon: 'Waves' },
  { name: 'Robotics & Automation', icon: 'Bot' },
  { name: 'Manufacturing & Production', icon: 'Wrench' },
  { name: 'Materials Science & Engineering', icon: 'Layers' },
  { name: 'Renewable Energy Systems', icon: 'Leaf' },
  { name: 'Automotive Engineering', icon: 'Car' }
];

export const events = [
  {
    date: '2020-09-22',
    title: 'Hackathon for Combating Coronavirus',
    description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui...',
    image: 'https://picsum.photos/seed/event1/800/600'
  },
  {
    date: '2020-10-13',
    title: 'Alumni Award Night',
    description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem...',
    image: 'https://picsum.photos/seed/event2/800/600'
  },
  {
    date: '2020-11-17',
    title: 'ICT Carnival',
    description: 'But I must explain to you how all this mistaken idea of...',
    image: 'https://picsum.photos/seed/event3/800/600'
  }
];

export const news = [
  {
    id: 1,
    category: 'Events',
    title: 'AI Engineering Career & Workshop Held at Daffodil International University',
    date: '8/31/2025',
    image: 'https://picsum.photos/seed/news_main/1200/800',
    isMain: true
  },
  {
    id: 2,
    category: 'Events',
    title: 'AI Engineering Career & Workshop Held at Daffodil International University',
    date: '8/31/2025',
    image: 'https://picsum.photos/seed/news2/400/300'
  },
  {
    id: 3,
    category: 'Archive',
    title: 'Daffodil International University hosts Bangladesh Olympiad in Informatics 2024',
    date: '4/29/2024',
    image: 'https://picsum.photos/seed/news3/400/300'
  },
  {
    id: 4,
    category: 'Archive',
    title: 'Bangladesh Telecommunication Regulatory Commission (BTRC) and DIU join hands...',
    date: '11/27/2023',
    image: 'https://picsum.photos/seed/news4/400/300'
  },
  {
    id: 5,
    category: 'Archive',
    title: 'Department of Computer Science & Engineering (CSE) organized Seminar on “Lecture from Industry-Academia”',
    date: '10/15/2023',
    image: 'https://picsum.photos/seed/news5/400/300'
  }
];

export const campusServices: { name: string; description: string; image: string; href?: string }[] = [
  { name: 'Transport Service', description: 'Free buses on 10 routes covering Dhaka & nearby areas.', image: '/assets/transport/dsc01671.jpg', href: '/transport-service' },
  { name: 'Scholarships & Waivers', description: 'Merit grants up to 100% + need-based aid calculator.', image: '/assets/scholarship-cover.jpg', href: '/admission/waiver-scholarship' },
  { name: 'Student Life', description: '50+ clubs, festivals, sports & volunteering.', image: '/assets/student-life-cover.jpg', href: '/student-society/club-list' }
];
