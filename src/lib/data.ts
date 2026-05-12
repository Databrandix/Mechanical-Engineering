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
    image: '/assets/program-undergraduate.png',
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
  { name: 'ERP', href: 'http://sue.su.edu.bd:5081/sonargaon_erp/', external: true },
  { name: 'Admission Notice', href: '/admission/notice' },
  { name: 'Library', href: 'http://lib.su.edu.bd', external: true },
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

export const campusServices: { name: string; description: string; image: string; href?: string }[] = [
  { name: 'Transport Service', description: 'Free buses on 10 routes covering Dhaka & nearby areas.', image: '/assets/transport/dsc01671.jpg', href: '/transport-service' },
  { name: 'Scholarships & Waivers', description: 'Merit grants up to 100% + need-based aid calculator.', image: '/assets/scholarship-cover.jpg', href: '/admission/waiver-scholarship' },
  { name: 'Student Life', description: '50+ clubs, festivals, sports & volunteering.', image: '/assets/student-life-cover.jpg', href: '/student-society/club-list' }
];
