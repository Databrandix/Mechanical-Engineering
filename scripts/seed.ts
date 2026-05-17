/* Seed content tables + bootstrap the first super-admin.
 *
 * Idempotent: re-running upserts singletons, skips duplicate research
 * areas, and skips super-admin bootstrap if any user already exists.
 *
 * Required env at run time:
 *   DATABASE_URL
 *   INITIAL_SUPER_ADMIN_EMAIL
 *   INITIAL_SUPER_ADMIN_PASSWORD
 */
import bcrypt from 'bcryptjs';
import type { Prisma } from '@prisma/client';
import { prisma } from '../src/lib/db';
import { faculty as facultyData } from '../src/lib/faculty-data';
import { labs as labsData } from '../src/lib/labs-data';
import { news as newsData } from '../src/lib/news-data';
import { events as eventsData } from '../src/lib/events-data';
import { notices as noticesData } from '../src/lib/notices-data';
import { galleryImages as galleryData } from '../src/lib/gallery-data';
import { alumni as alumniData } from '../src/lib/alumni-data';
import { clubs as clubsData } from '../src/lib/clubs-data';
import { faqs as faqData } from '../src/lib/faq-data';
import { visitors as visitorsData } from '../src/lib/visitors-data';
import { researchPapers as researchPapersData } from '../src/lib/research-data';
import { busRoutes as busRoutesData } from '../src/lib/transport-data';

const BCRYPT_ROUNDS = 12;

async function seedDepartmentIdentity() {
  await prisma.departmentIdentity.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      name: 'Department of Mechanical Engineering',
      shortCode: 'ME',
      facultyName: 'Faculty of Science & Engineering',
      primaryColor: '#2B3175',
      accentColor: '#CC1579',
      buttonColor: '#F8BD23',
      logoUrl: '/assets/su-colour-logo.webp',
      logoPublicId: null,
      breadcrumbLabel: 'ME',
      heroImage1Url: '/assets/hero-1.webp',
      heroImage1PublicId: null,
      heroImage2Url: '/assets/hero-2.webp',
      heroImage2PublicId: null,
      heroImage3Url: '/assets/hero-3.webp',
      heroImage3PublicId: null,
    },
  });
  console.log('✓ Department identity seeded');
}

async function seedUniversityIdentity() {
  await prisma.universityIdentity.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      name: 'Sonargaon University',
      address: '147/I, Green Road, Panthapath, Tejgaon, Dhaka',
      phones: ['+8801775000888', '+880241010352'],
      emails: ['info@su.edu.bd'],
      facebookUrl: 'https://www.facebook.com/SonargaonUniversity',
      instagramUrl: 'https://www.instagram.com/sonargaonuniversitybd/',
      youtubeUrl: 'https://www.youtube.com/@SonargaonUniversityEdu',
      linkedinUrl: 'https://www.linkedin.com/school/14451954/',
      xUrl: 'https://x.com/SonargaonUni',
      tiktokUrl: 'https://www.tiktok.com/@sonargaonuniversityedu',
      whatsappUrl: null,
      threadsUrl: 'https://www.threads.com/@sonargaonuniversitybd',
      erpUrl: 'http://sue.su.edu.bd:5081/sonargaon_erp/',
      applyUrl:
        'http://sue.su.edu.bd:5081/sonargaon_erp/siteadmin/create_smart_panel',
      libraryUrl: 'http://lib.su.edu.bd',
      iqacUrl: 'https://su.edu.bd/iqac',
      careerUrl: 'https://su.edu.bd/welcome/career',
      noticeUrl: 'https://su.edu.bd/welcome/notice',
      copyrightText:
        'Copyright © 2026 All Rights Reserved by Sonargaon University',
      mapEmbedUrl:
        'https://maps.google.com/maps?q=Sonargaon%20University%20Panthapath%20Dhaka&hl=en&z=15&output=embed',
      logoUrl: '/assets/footer-logo.webp',
      logoPublicId: null,
    },
  });
  console.log('✓ University identity seeded');
}

async function seedPrograms() {
  await prisma.program.upsert({
    where: { degreeCode: 'BSc-ME' },
    update: {},
    create: {
      programName: 'Undergraduate — B.Sc in Mechanical Engineering',
      degreeCode: 'BSc-ME',
      duration: '4 Years · 8 Semesters',
      description:
        'Our flagship undergraduate program builds a strong foundation in core mechanical engineering — combining rigorous theory, modern lab practice, and design projects that prepare graduates for industry, research, and global postgraduate study.',
      displayOrder: 1,
      imageUrl: '/assets/program-undergraduate.webp',
      imagePublicId: null,
      specializations: [
        'Thermal Engineering',
        'Design & Manufacturing',
        'Robotics & Automation',
        'Energy Systems',
      ],
      cta: 'View More',
    },
  });
  console.log('✓ Programs seeded');
}

async function seedResearchAreas() {
  const areas = [
    { iconName: 'Flame',  areaName: 'Thermodynamics & Heat Transfer',   displayOrder: 1 },
    { iconName: 'Waves',  areaName: 'Fluid Mechanics & CFD',            displayOrder: 2 },
    { iconName: 'Bot',    areaName: 'Robotics & Automation',            displayOrder: 3 },
    { iconName: 'Wrench', areaName: 'Manufacturing & Production',       displayOrder: 4 },
    { iconName: 'Layers', areaName: 'Materials Science & Engineering',  displayOrder: 5 },
    { iconName: 'Leaf',   areaName: 'Renewable Energy Systems',         displayOrder: 6 },
    { iconName: 'Car',    areaName: 'Automotive Engineering',           displayOrder: 7 },
  ];

  let inserted = 0;
  for (const area of areas) {
    const existing = await prisma.researchArea.findFirst({
      where: { areaName: area.areaName },
    });
    if (existing) continue;
    await prisma.researchArea.create({ data: area });
    inserted += 1;
  }
  console.log(`✓ Research areas seeded (${inserted} new)`);
}

async function bootstrapSuperAdmin() {
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log(`✓ Super-admin bootstrap skipped — ${userCount} user(s) already exist`);
    return;
  }

  const email = process.env.INITIAL_SUPER_ADMIN_EMAIL;
  const password = process.env.INITIAL_SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'No users exist and INITIAL_SUPER_ADMIN_EMAIL / INITIAL_SUPER_ADMIN_PASSWORD are not set. Cannot bootstrap super-admin.',
    );
  }

  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name: 'Super Admin',
      role: 'super_admin',
      isActive: true,
    },
  });

  // Better Auth convention for credentials provider:
  //   account.providerId = "credential", account.accountId = user.id
  await prisma.account.create({
    data: {
      userId: user.id,
      providerId: 'credential',
      accountId: user.id,
      password: hash,
    },
  });

  console.log(`✓ Super-admin bootstrapped: ${email}`);
}

// ─────────────────────────────────────────────────────────────────
//  Faculty seed — 41 rows from src/lib/faculty-data.ts, plus Dean
//  and Head message extras extracted from the about pages.
// ─────────────────────────────────────────────────────────────────

const DEAN_SLUG = 'habibur-rahman-kamal';
const HEAD_SLUG = 'mostofa-hossain';

// Inline <strong class="text-button-yellow">…</strong> preserved per
// J1 (raw HTML, super_admin-trusted, rendered via
// dangerouslySetInnerHTML in the message component). No drop-cap
// span here — that's render-side per J2.
const DEAN_MESSAGE_PARAGRAPHS = [
  'Welcome to the Department of Mechanical Engineering, the largest and most established department within the Faculty of Science and Engineering. Over the last decade, we have built a strong reputation for academic excellence, supported by a dedicated team of nearly 50 full-time faculty members from top-tier institutions like <strong class="text-button-yellow">BUET, KUET, and RUET</strong>.',
  'Our mission is to bridge the gap between creativity and technology by providing a modern learning environment equipped with high-tech laboratories and air-conditioned, multimedia classrooms. We pride ourselves on the global success of our graduates, many of whom are currently excelling in postgraduate programs across the USA, Canada, and the EU with prestigious scholarships.',
  'Beyond the classroom, our students consistently demonstrate their practical expertise, as evidenced by the recent recognition of the <strong class="text-button-yellow">Sonargaon University Mecha Club</strong> at the BUET Auto Fest. We are committed to fostering your growth as a skilled engineer and a responsible citizen, prepared to solve the complex technological challenges of the future.',
];

const HEAD_MESSAGE_PARAGRAPHS = [
  'Mechanical Engineering is the largest department of the university. The Department started its journey in the year of 2013 and has already passed a decade. In the last decade, we have developed our expertise and competency in curriculum and research. Our main goal is to provide quality education in both theory and practical to the undergraduate students, so that they can build their foundation strongly. There are about 50 (Fifty) highly educated, qualified and experienced permanent full-time faculty members from BUET, KUET, RUET, CUET, DUET, IUT, DU, CU, RU, JU and other public universities engaged in the Department. A large number of our graduates are regularly getting enrolments in Post-graduate programs in reputed universities around the world, particularly in the USA, Canada, Australia and the EU with prestigious scholarships, as well as a good number of faculty members are also on study leave in different countries pursuing their higher education.',
  'The university is located in the heart of the city, with easy access to Metro-Rail Station, City and Inter-district bus services. It provides free bus services around the city and downtown — Mograpara, Gauchhia, Kadamtali in the east, Abdullahpur in the north and Savar in the west.',
  '50% to 100% Waiver on tuition fees and scholarship is also available on the basis of semester results. Air-conditioned classrooms with multimedia projectors, lab facilities equipped with all types of equipments and machineries as per courses of the department, as well as Computer Lab with the latest and updated computers and software are also available in the Department.',
  'It is noteworthy that efficient and experienced professors of BUET have been appointed as advisors to the department. Students have participated in different competitive events and have kept the signatures of many accomplishments.',
  'ACI Motors Ltd. presents Auto Fest 2024 was held from February 01, 2024 to February 08, 2024, organized by Mechanical Engineering Association, BUET. Sonargaon University Mecha Club (SUMEC) of the Department of Mechanical Engineering participated in this Fest and achieved a token of appreciation as <strong class="text-button-yellow">Valuable Club Partner</strong>. Participation, collaboration and contribution of SUMEC significantly enriched the initiatives of the Fest.',
  'Therefore, Welcome to the Department of Mechanical Engineering — pursue your undergraduate degree and make yourself an Engineer as well as a good citizen to serve the country.',
];

// TS source uses hyphenated literal types; Prisma enum uses underscores.
function mapFacultyType(t: 'leadership' | 'full-time' | 'part-time') {
  if (t === 'leadership') return 'leadership' as const;
  if (t === 'full-time') return 'full_time' as const;
  return 'part_time' as const;
}

async function seedFaculty() {
  const before = await prisma.faculty.count();

  for (let i = 0; i < facultyData.length; i++) {
    const f = facultyData[i];
    const isDean = f.slug === DEAN_SLUG;
    const isHead = f.slug === HEAD_SLUG;

    const messageFields = isDean
      ? {
          isDean: true,
          messageOverline: 'A Note from the Dean',
          messageHeading: 'Welcome Message',
          messageParagraphs: DEAN_MESSAGE_PARAGRAPHS,
          messagePhotoUrl: '/assets/faculty-dean-kamal.webp',
          messageTitleLine1: 'Dean',
          messageTitleLine2: 'Faculty of Science & Engineering',
          messageHeroImageUrl: '/assets/mission-vision-hero.webp',
          messageHeroImagePosition: 'center 3%',
        }
      : isHead
        ? {
            isHead: true,
            messageOverline: 'A Note from the Head',
            messageHeading: 'Welcome Message',
            messageParagraphs: HEAD_MESSAGE_PARAGRAPHS,
            // Head's-message page uses a different photo than Head's
            // [slug] page — see J-finding in CP2.1 surface.
            messagePhotoUrl: '/assets/head-mostofa-hossain.webp',
            messageTitleLine1: 'Head of the Department',
            messageTitleLine2: 'Department of Mechanical Engineering',
            messageHeroImageUrl: '/assets/message-from-head-hero.webp',
            messageHeroImagePosition: 'center top',
          }
        : {};

    await prisma.faculty.upsert({
      where: { slug: f.slug },
      // Idempotent: re-running won't override admin edits to existing rows
      update: {},
      create: {
        slug:           f.slug,
        name:           f.name,
        designation:    f.designation,
        secondaryTitle: f.secondaryTitle ?? null,
        badge:          f.badge ?? null,
        type:           mapFacultyType(f.type),
        displayOrder:   i,
        photoUrl:       f.photo ?? null,
        email:          f.email ?? null,
        phone:          f.phone ?? null,
        suId:           f.suId ?? null,
        // Json columns — source values are typed as the loose union
        // (string | string[] | { heading; items }[]) which TS can't
        // narrow to Prisma's InputJsonValue without a cast. The cast
        // is honest about the runtime contract (we know these are
        // JSON-serializable) and replaces the prior misleading
        // `as object | undefined` (string isn't an object).
        personalInfo:          (f.personalInfo          ?? undefined) as Prisma.InputJsonValue | undefined,
        academicQualification: (f.academicQualification ?? undefined) as Prisma.InputJsonValue | undefined,
        trainingExperience:    (f.trainingExperience    ?? undefined) as Prisma.InputJsonValue | undefined,
        teachingArea:          (f.teachingArea          ?? undefined) as Prisma.InputJsonValue | undefined,
        publications:          (f.publications          ?? undefined) as Prisma.InputJsonValue | undefined,
        research:              (f.research              ?? undefined) as Prisma.InputJsonValue | undefined,
        awards:                (f.awards                ?? undefined) as Prisma.InputJsonValue | undefined,
        membership:            (f.membership            ?? undefined) as Prisma.InputJsonValue | undefined,
        previousEmployment:    (f.previousEmployment    ?? undefined) as Prisma.InputJsonValue | undefined,
        ...messageFields,
      },
    });
  }

  const after = await prisma.faculty.count();
  console.log(`✓ Faculty seeded (before: ${before}, after: ${after}, created: ${after - before})`);
}

// ════════════════════════════════════════════════════════════════
//  PHASE 3 — chrome structure (backfills + chrome tables)
//  Pattern: backfill null fields on existing singletons, bulk insert
//  on empty new tables. Never overwrites admin-edited values.
// ════════════════════════════════════════════════════════════════

async function backfillDepartmentIdentityAlts() {
  const row = await prisma.departmentIdentity.findUnique({ where: { id: 'singleton' } });
  if (!row) return;
  const heroAlts = [
    'Sonargaon University Mechanical Engineering Department',
    'Sonargaon University Mechanical Engineering students and faculty',
    'Sonargaon University Mechanical Engineering campus',
  ];
  const updates: Record<string, string> = {};
  if (!row.heroImage1Alt) updates.heroImage1Alt = heroAlts[0];
  if (!row.heroImage2Alt) updates.heroImage2Alt = heroAlts[1];
  if (!row.heroImage3Alt) updates.heroImage3Alt = heroAlts[2];
  if (Object.keys(updates).length) {
    await prisma.departmentIdentity.update({ where: { id: 'singleton' }, data: updates });
    console.log(`✓ Department identity hero alts backfilled (${Object.keys(updates).length} fields)`);
  } else {
    console.log('✓ Department identity hero alts already populated');
  }
}

async function backfillFeaturedResearchArea() {
  // Promote "Robotics & Automation" to isFeatured=true and populate
  // featured-card content from the previously hardcoded block in
  // MajorResearchSection.tsx. areaName stays unchanged (grid card
  // visual identical); featuredHeading carries the longer card title.
  const existingFeatured = await prisma.researchArea.findFirst({ where: { isFeatured: true } });
  if (existingFeatured) {
    console.log(`✓ Featured research area already set (${existingFeatured.areaName})`);
    return;
  }
  const target = await prisma.researchArea.findFirst({ where: { areaName: 'Robotics & Automation' } });
  if (!target) {
    console.log('⚠ Robotics & Automation row not found; skipping featured backfill');
    return;
  }
  await prisma.researchArea.update({
    where: { id: target.id },
    data: {
      isFeatured: true,
      featuredHeading: 'Robotics & Industrial Automation',
      featuredImageUrl: '/assets/research-featured.webp',
      featuredImagePublicId: null,
      featuredDescription:
        'This research cell operates at the intersection of mechanical design and intelligent control, building autonomous systems for next-generation manufacturing...',
      featuredCtaHref: '/research',
    },
  });
  console.log('✓ Featured research area set (Robotics & Automation → featured)');
}

async function seedTopLinks() {
  const count = await prisma.topLink.count();
  if (count > 0) {
    console.log(`✓ Top links already seeded (${count} rows)`);
    return;
  }
  const rows = [
    { name: 'Virtual Tour',  href: null,                                  isExternal: false, isDisabled: true,  displayOrder: 1 },
    { name: 'IQAC',          href: 'https://su.edu.bd/iqac',              isExternal: true,  isDisabled: false, displayOrder: 2 },
    { name: 'Career',        href: 'https://su.edu.bd/welcome/career',    isExternal: true,  isDisabled: false, displayOrder: 3 },
    { name: 'Archive',       href: null,                                  isExternal: false, isDisabled: true,  displayOrder: 4 },
    { name: 'Contact',       href: '/contact',                            isExternal: false, isDisabled: false, displayOrder: 5 },
  ];
  await prisma.topLink.createMany({ data: rows });
  console.log(`✓ Top links seeded (${rows.length} rows)`);
}

async function seedQuickAccessItems() {
  const count = await prisma.quickAccessItem.count();
  if (count > 0) {
    console.log(`✓ Quick access items already seeded (${count} rows)`);
    return;
  }
  const rows = [
    { name: 'Library',       href: 'http://lib.su.edu.bd',                                                            iconName: 'BookOpen',       isExternal: true,  isDisabled: false, displayOrder: 1  },
    { name: 'Admission',     href: '/admission/requirements',                                                         iconName: 'GraduationCap',  isExternal: false, isDisabled: false, displayOrder: 2  },
    { name: 'Photo',         href: '/gallery',                                                                        iconName: 'Image',          isExternal: false, isDisabled: false, displayOrder: 3  },
    { name: 'Virtual Tour',  href: null,                                                                              iconName: 'Compass',        isExternal: false, isDisabled: true,  displayOrder: 4  },
    { name: 'Archive',       href: null,                                                                              iconName: 'Archive',        isExternal: false, isDisabled: true,  displayOrder: 5  },
    { name: 'Notice',        href: 'https://su.edu.bd/welcome/notice',                                                iconName: 'Users',          isExternal: true,  isDisabled: false, displayOrder: 6  },
    { name: 'ERP',           href: 'http://sue.su.edu.bd:5081/sonargaon_erp/',                                        iconName: 'Globe',          isExternal: true,  isDisabled: false, displayOrder: 7  },
    { name: 'IQAC',          href: 'https://su.edu.bd/iqac',                                                          iconName: 'ClipboardList',  isExternal: true,  isDisabled: false, displayOrder: 8  },
    { name: 'Skill Jobs',    href: 'https://su.edu.bd/welcome/career',                                                iconName: 'Building2',      isExternal: true,  isDisabled: false, displayOrder: 9  },
    { name: 'Convoc. Reg.',  href: 'http://sue.su.edu.bd:5081/sonargaon_erp/student/convocation_registration',       iconName: 'Award',          isExternal: true,  isDisabled: false, displayOrder: 10 },
    { name: 'Verification',  href: 'https://su.edu.bd/welcome/degree_verification',                                   iconName: 'CheckCircle',    isExternal: true,  isDisabled: false, displayOrder: 11 },
  ];
  await prisma.quickAccessItem.createMany({ data: rows });
  console.log(`✓ Quick access items seeded (${rows.length} rows)`);
}

async function seedMainNav() {
  const count = await prisma.mainNavGroup.count();
  if (count > 0) {
    console.log(`✓ Main nav already seeded (${count} groups)`);
    return;
  }
  // Read the current applyUrl from UniversityIdentity so the seeded
  // "Apply Online" item carries the live value at seed time. Admin
  // edits to UniversityIdentity.applyUrl after seed don't auto-sync
  // here — they must update both places. See CP3.1 commit message.
  const universityIdentity = await prisma.universityIdentity.findUnique({ where: { id: 'singleton' } });
  const applyUrl = universityIdentity?.applyUrl ?? 'http://sue.su.edu.bd:5081/sonargaon_erp/siteadmin/create_smart_panel';

  const groups = [
    {
      name: 'About', href: null, hasDropdown: true, title: 'About', displayOrder: 1,
      items: [
        { name: 'Message from Head',   href: '/about/message-from-head',   displayOrder: 1 },
        { name: 'Mission & Vision',    href: '/about/mission-vision',      displayOrder: 2 },
        { name: 'Laboratory Facility', href: '/about/laboratory-facility', displayOrder: 3 },
        { name: 'Mecha Club',          href: '/about/mecha-club',          displayOrder: 4 },
        { name: 'Lab Facility',        href: '/about/lab-facility',        displayOrder: 5 },
      ],
    },
    {
      name: 'Faculty Member', href: '/faculty-member', hasDropdown: false, title: null, displayOrder: 2,
      items: [],
    },
    {
      name: 'Admission', href: null, hasDropdown: true, title: 'Admission', displayOrder: 3,
      items: [
        { name: 'Admission Requirements', href: '/admission/requirements',       displayOrder: 1 },
        { name: 'Tuition Fees',           href: '/admission/tuition-fees',       displayOrder: 2 },
        { name: 'Transfer Credits',       href: '/admission/transfer-credits',   displayOrder: 3 },
        { name: 'Waiver & Scholarship',   href: '/admission/waiver-scholarship', displayOrder: 4 },
        { name: 'Admission Notice',       href: '/admission/notice',             displayOrder: 5 },
        { name: 'Prospectus',             href: '/admission/prospectus',         displayOrder: 6 },
        { name: 'Apply Online',           href: applyUrl, isExternal: true,      displayOrder: 7 },
      ],
    },
    {
      name: 'Student Society', href: null, hasDropdown: true, title: 'Student Society', displayOrder: 4,
      items: [
        { name: 'Notice Board', href: '/student-society/notice-board', displayOrder: 1 },
        { name: 'Events',       href: '/student-society/events',       displayOrder: 2 },
        { name: 'Alumni',       href: '/student-society/alumni',       displayOrder: 3 },
        { name: 'Visitor',      href: '/student-society/visitor',      displayOrder: 4 },
        { name: 'FAQ',          href: '/student-society/faq',          displayOrder: 5 },
        { name: 'Syllabus',     href: '/student-society/syllabus',     displayOrder: 6 },
        { name: 'Club list',    href: '/student-society/club-list',    displayOrder: 7 },
      ],
    },
    {
      name: 'Contact', href: '/contact', hasDropdown: false, title: null, displayOrder: 5,
      items: [],
    },
  ];

  let totalItems = 0;
  for (const g of groups) {
    const { items, ...groupData } = g;
    const created = await prisma.mainNavGroup.create({ data: groupData });
    if (items.length) {
      await prisma.mainNavItem.createMany({
        data: items.map(i => ({
          groupId: created.id,
          name: i.name,
          href: i.href,
          isExternal: i.isExternal ?? false,
          isDisabled: false,
          displayOrder: i.displayOrder,
        })),
      });
      totalItems += items.length;
    }
  }
  console.log(`✓ Main nav seeded (${groups.length} groups, ${totalItems} items)`);
}

async function seedFooterUsefulLinks() {
  const count = await prisma.footerUsefulLink.count();
  if (count > 0) {
    console.log(`✓ Footer useful links already seeded (${count} rows)`);
    return;
  }
  const rows = [
    { name: 'Tuition Fee',   href: '/admission/tuition-fees',           isExternal: false, isDisabled: false, displayOrder: 1 },
    { name: 'Faculty Staff', href: '/faculty-member',                   isExternal: false, isDisabled: false, displayOrder: 2 },
    { name: 'Alumni',        href: '/student-society/alumni',           isExternal: false, isDisabled: false, displayOrder: 3 },
    { name: 'Career',        href: 'https://su.edu.bd/welcome/career',  isExternal: true,  isDisabled: false, displayOrder: 4 },
    { name: 'Event',         href: '/student-society/events',           isExternal: false, isDisabled: false, displayOrder: 5 },
    { name: 'Our Blogs',     href: null,                                isExternal: false, isDisabled: true,  displayOrder: 6 },
  ];
  await prisma.footerUsefulLink.createMany({ data: rows });
  console.log(`✓ Footer useful links seeded (${rows.length} rows)`);
}

async function seedFooterGetInTouchLinks() {
  const count = await prisma.footerGetInTouchLink.count();
  if (count > 0) {
    console.log(`✓ Footer get-in-touch links already seeded (${count} rows)`);
    return;
  }
  const rows = [
    { name: 'Contact',           href: '/contact',                                        isExternal: false, isDisabled: false, displayOrder: 1 },
    { name: 'Meet With Us',      href: '/contact',                                        isExternal: false, isDisabled: false, displayOrder: 2 },
    { name: 'Privacy Statement', href: 'https://su.edu.bd/about_us/privacy_policy',       isExternal: true,  isDisabled: false, displayOrder: 3 },
    { name: 'Newsletters',       href: null,                                              isExternal: false, isDisabled: true,  displayOrder: 4 },
    { name: 'Location Map',      href: '/contact',                                        isExternal: false, isDisabled: false, displayOrder: 5 },
    { name: 'FAQ',               href: '/student-society/faq',                            isExternal: false, isDisabled: false, displayOrder: 6 },
  ];
  await prisma.footerGetInTouchLink.createMany({ data: rows });
  console.log(`✓ Footer get-in-touch links seeded (${rows.length} rows)`);
}

async function seedFooterQuickLinks() {
  const count = await prisma.footerQuickLink.count();
  if (count > 0) {
    console.log(`✓ Footer quick links already seeded (${count} rows)`);
    return;
  }
  const rows = [
    { name: 'SU News',        href: '/news',                                                  isExternal: false, isDisabled: false, displayOrder: 1 },
    { name: 'Forum',          href: null,                                                     isExternal: false, isDisabled: true,  displayOrder: 2 },
    { name: 'Students',       href: null,                                                     isExternal: false, isDisabled: true,  displayOrder: 3 },
    { name: 'Parents',        href: null,                                                     isExternal: false, isDisabled: true,  displayOrder: 4 },
    { name: 'Teachers',       href: 'https://su.edu.bd/faculty_members/all_faculty_details', isExternal: true,  isDisabled: false, displayOrder: 5 },
    { name: 'Administration', href: 'https://su.edu.bd/About_us/new_administration/4',       isExternal: true,  isDisabled: false, displayOrder: 6 },
  ];
  await prisma.footerQuickLink.createMany({ data: rows });
  console.log(`✓ Footer quick links seeded (${rows.length} rows)`);
}

async function seedFooterLegalLinks() {
  const count = await prisma.footerLegalLink.count();
  if (count > 0) {
    console.log(`✓ Footer legal links already seeded (${count} rows)`);
    return;
  }
  const rows = [
    { name: 'Privacy Statement', href: 'https://su.edu.bd/about_us/privacy_policy', isExternal: true,  isDisabled: false, displayOrder: 1 },
    { name: 'Terms of Use',      href: 'https://su.edu.bd/about_us/privacy_policy', isExternal: true,  isDisabled: false, displayOrder: 2 },
    { name: 'Sitemap',           href: '/sitemap.xml',                              isExternal: false, isDisabled: false, displayOrder: 3 },
  ];
  await prisma.footerLegalLink.createMany({ data: rows });
  console.log(`✓ Footer legal links seeded (${rows.length} rows)`);
}

// ════════════════════════════════════════════════════════════════
//  PHASE 4 — About pages (3 singleton models)
//  Pattern: upsert with update={} so re-running never overwrites
//  admin edits to existing rows; create path populates from the
//  pre-Phase-4 hardcoded page content.
// ════════════════════════════════════════════════════════════════

async function seedAboutOverview() {
  await prisma.aboutOverview.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      heroTitle:         'Department Overview',
      heroSubtitle:      'Shaping future leaders where creativity meets technology.',
      heroOverline:      null,
      heroImageUrl:      '/assets/mission-vision-hero.webp',
      heroImagePublicId: null,
      heroImagePosition: 'center 3%',
      paragraphs: [
        'At the heart of innovation and excellence, the Department of Mechanical Engineering is committed to shaping future leaders in the field. Explore the dynamic world of mechanical engineering, where creativity meets technology, and where ideas transform into groundbreaking solutions.',
        'At the Department of Mechanical Engineering, we strive to shape the future of engineering by providing cutting-edge education and research opportunities. With a focus on interdisciplinary collaboration and real-world applications, our department prepares students to tackle complex challenges and contribute to the advancement of technology and society.',
        'The main responsibility of the Department of Mechanical Engineering is to design, analyze, test, and manufacture machines and equipment. Mechanical Engineering is a vast and heterogeneous field in respect of the different types of products that the engineers work on, the industry in which they work, and the knowledge they need to become successful.',
        'The Mechanical Engineers, who are interested in pursuing a career, have the attributes such as: the idea of what Mechanical Engineers work on, the function that Mechanical Engineers fulfill, the type of work environment, and the industries that they serve. Mechanical engineers are involved in a comprehensive variety of products like aircraft, automobile vehicles, industrial equipment and machinery, engines, turbines, pumps, mechanical handling systems, heating and cooling systems, consumer devices, and so on.',
      ],
    },
  });
  console.log('✓ AboutOverview seeded');
}

async function seedAboutMissionVision() {
  await prisma.aboutMissionVision.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      heroTitle:         'Mission & Vision',
      heroOverline:      'About',
      heroImageUrl:      '/assets/mission-vision-hero.webp',
      heroImagePublicId: null,
      heroImagePosition: 'center 3%',

      missionOverline: 'Our Purpose',
      missionHeading:  'Mission',
      missionBody:
        'The mission of the Department is to provide knowledge to students in science and technology through world-class education and innovative research, empower innovators, shape the future, and provide a transformative learning experience that nurtures creativity, instills a strong foundation of knowledge, and equips students with the skills to address global challenges through cutting-edge mechanical engineering solutions — so that they are able to contribute impactfully to society, the nation and the world, and to develop the professional potential and skill of faculty, staff and students by maintaining training and education by which they can achieve lifelong ability to construct their professional careers.',

      visionOverline: 'Our Future',
      visionHeading:  'Vision',
      visionBody:
        'Through the active participation of its people, the Department of Mechanical Engineering will be acknowledged as a leader of its discipline, illustrating quality education, research and innovation. With quality education and research, the department will be enabled to create skilled and well-qualified engineers to meet the continually changing technological, regional and national needs.',
    },
  });
  console.log('✓ AboutMissionVision seeded');
}

async function seedAboutMechaClub() {
  await prisma.aboutMechaClub.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      heroTitle:         'SU Mecha Club',
      heroOverline:      'About',
      heroImageUrl:      '/assets/mecha-hero.webp',
      heroImagePublicId: null,
      heroImagePosition: 'center 45%',

      introOverline: 'Where Engineering Meets Community',
      // Inline HTML preserved — gradient on "Mechanical Engineers"
      introHeading:
        'Building Industry-Ready <span class="text-gradient">Mechanical Engineers</span>',
      introBody1:
        'The Mechanical Engineering department at Sonargaon University fosters a vibrant student community through its dedicated club and organisational activities. We focus on transforming students into industry-ready professionals through continuous engagement and practical exposure.',
      introBody2:
        'From plant visits to international software training, the SU Mecha Club bridges classroom learning with the real world — equipping every member with the skills, network, and confidence to lead.',
      introImageUrl:      '/assets/mecha-club-1.webp',
      introImagePublicId: null,

      stats: [
        { value: '100+', label: 'Active Members' },
        { value: '50+',  label: 'Field Visits' },
        { value: '25+',  label: 'Workshops Hosted' },
        { value: '10+',  label: 'Industry Partners' },
      ],

      activitiesOverline: 'What We Do',
      activitiesHeading:  'Core Activities & Initiatives',
      activities: [
        {
          iconName: 'Factory',
          imageUrl: '/assets/mecha-field-visit.webp',
          imagePublicId: null,
          category: 'Industrial Exposure',
          title: 'Field Visits to Leading Plants',
          description:
            'Regularly organised industrial tours to power plants, textile machinery units and large-scale manufacturing facilities — giving students a firsthand look at real mechanical operations and management.',
        },
        {
          iconName: 'Laptop',
          imageUrl: '/assets/mecha-workshop.webp',
          imagePublicId: null,
          category: 'Skill Development',
          title: 'Hands-on Software Workshops',
          description:
            'Specialized training sessions on industry-standard engineering software including AutoCAD and SolidWorks, ensuring students are proficient in digital design before they graduate.',
        },
        {
          iconName: 'Mic',
          imageUrl: '/assets/mecha-seminar.webp',
          imagePublicId: null,
          category: 'Career Guidance',
          title: 'Seminars with Industry Experts',
          description:
            'Frequent seminars featuring industry leaders and corporate experts that provide insights into local and international job markets — manufacturing, energy, and the public sector.',
        },
        {
          iconName: 'Lightbulb',
          imageUrl: '/assets/mecha-project.webp',
          imagePublicId: null,
          category: 'Innovation',
          title: 'Project Showcases & Tech Fairs',
          description:
            'Students display engineering prototypes and innovative solutions during university-wide tech fairs and departmental exhibitions, sharpening their presentation and engineering skills.',
        },
        {
          iconName: 'Sparkles',
          imageUrl: '/assets/mecha-cocurricular.webp',
          imagePublicId: null,
          category: 'Community',
          title: 'Co-curricular Engagement',
          description:
            'Beyond technical skills — indoor games, cultural programs and study tours that foster a well-rounded university experience and strong bonding between batches.',
        },
        {
          iconName: 'Award',
          imageUrl: '/assets/mecha-appreciation.webp',
          imagePublicId: null,
          category: 'Recognition',
          title: 'Awards & Industry Recognition',
          description:
            'SUMEC was honoured as a Valuable Club Partner at ACI Motors-presented Auto Fest 2024 (organised by ME Association, BUET) — one of many recognitions earned through active participation, collaboration, and engineering excellence.',
        },
      ],

      networkOverline:          'Beyond Graduation',
      networkHeading:           'Building a Professional Network',
      networkBody:
        'The Mecha Club community serves as a bridge between current students and the SU Alumni — creating an active professional network that opens doors to internships, job placements, and lifelong mentorship across the engineering industry.',
      networkPrimaryCtaLabel:   'Join the Club',
      networkPrimaryCtaHref:    'https://www.facebook.com/su.mechanical.engineering',
      networkSecondaryCtaLabel: 'Alumni Portal',
      networkSecondaryCtaHref:
        'http://sue.su.edu.bd:5081/sonargaon_erp/student/convocation_registration/alumni',
    },
  });
  console.log('✓ AboutMechaClub seeded');
}

// ════════════════════════════════════════════════════════════════
//  PHASE 5 — Lab systems (4 models: 2 singletons + 2 multi-row)
//  Pattern: upsert with update={} on singletons, bulk-insert-when-
//  empty on multi-row tables (idempotent, admin edits survive).
// ════════════════════════════════════════════════════════════════

async function seedLabFacilityLanding() {
  await prisma.labFacilityLanding.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      heroTitle:         'Lab Facilities',
      heroOverline:      'About',
      heroImageUrl:      '/assets/lab-hero.webp',
      heroImagePublicId: null,
      heroImagePosition: 'center 25%',
      introBody:
        'The Department of Mechanical Engineering provides international-standard education through a combination of theory and hands-on practical sessions. Our specialised laboratories are equipped with modern machinery and tools to prepare students for the global engineering market.',
    },
  });
  console.log('✓ LabFacilityLanding seeded');
}

async function seedLabs() {
  const count = await prisma.lab.count();
  if (count > 0) {
    console.log(`✓ Labs already seeded (${count} rows)`);
    return;
  }
  // Source: src/lib/labs-data.ts. galleryPublicIds is empty for
  // seed (local /assets/ paths have no Cloudinary id); admin
  // upload paths populate both arrays in parallel.
  let inserted = 0;
  for (let i = 0; i < labsData.length; i++) {
    const lab = labsData[i];
    await prisma.lab.create({
      data: {
        slug:              lab.slug,
        name:              lab.name,
        tagline:           lab.tagline,
        description:       lab.description,
        heroImageUrl:      lab.heroImage ?? null,
        heroImagePublicId: null,
        gallery:           lab.gallery ?? [],
        galleryPublicIds:  [],
        displayOrder:      i,
      },
    });
    inserted += 1;
  }
  console.log(`✓ Labs seeded (${inserted} rows)`);
}

async function seedLaboratoryFacilityLanding() {
  await prisma.laboratoryFacilityLanding.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      heroTitle:         'Laboratory Facility',
      heroOverline:      'About',
      heroImageUrl:      '/assets/lab-hero.webp',
      heroImagePublicId: null,
      heroImagePosition: 'center 25%',
      introBody:
        'The Department of Mechanical Engineering at Sonargaon University is committed to excellence in hands-on technical education. Our laboratories serve as the hub for innovation, where students apply complex thermodynamic, fluidic, and structural theories to real-world engineering challenges.',
      featuresOverline: 'What Sets Us Apart',
      featuresHeading:  'Why Our Labs Matter',
      // Source: features const in laboratory-facility/page.tsx.
      // Icon component refs mapped to Lucide name strings:
      //   Cog → "Cog"
      //   ShieldCheck → "ShieldCheck"
      //   FlaskConical → "FlaskConical"
      features: [
        {
          iconName: 'Cog',
          title: 'Industry-Standard Equipment',
          description: 'Access to machinery used in modern manufacturing and power plants.',
        },
        {
          iconName: 'ShieldCheck',
          title: 'Safety-First Environment',
          description: 'All labs are managed by expert technicians ensuring a secure learning environment.',
        },
        {
          iconName: 'FlaskConical',
          title: 'Research Driven',
          description: 'Facilities support senior design projects (Capstone) and faculty-led research in renewable energy and robotics.',
        },
      ],
    },
  });
  console.log('✓ LaboratoryFacilityLanding seeded');
}

async function seedLaboratoryLabs() {
  const count = await prisma.laboratoryLab.count();
  if (count > 0) {
    console.log(`✓ LaboratoryLabs already seeded (${count} rows)`);
    return;
  }
  // Source: labs const in laboratory-facility/page.tsx. iconName
  // mapped from Icon component refs (Flame → "Flame", etc.).
  // keyItems stored as plain string (Discovery #2 — preserved as
  // single comma-separated sentence to match current visual).
  const rows = [
    {
      iconName: 'Flame',
      title: 'Applied Thermodynamics & Heat Engine Laboratory',
      description:
        'Dedicated to the study of energy conversion and thermal systems. Students explore the mechanics of power generation and the operational cycles of various engines.',
      keyLabel: 'Key Equipment',
      keyItems:
        'Multi-cylinder petrol and diesel engines, steam generator models, and bomb calorimeters.',
      focus:
        'Internal Combustion (IC) engine performance, thermal efficiency, and combustion analysis.',
      displayOrder: 0,
    },
    {
      iconName: 'Droplets',
      title: 'Fluid Mechanics & Hydraulic Machinery Lab',
      description:
        'Fluid dynamics is essential to everything from piping systems to aerospace. This lab provides the tools to measure and analyze the behaviour of liquids and gases.',
      keyLabel: 'Key Equipment',
      keyItems:
        "Bernoulli's theorem apparatus, Orifice meters, Venturi meters, and centrifugal pump test rigs.",
      focus:
        'Flow measurement, pressure drops, and the operational characteristics of hydraulic turbines.',
      displayOrder: 1,
    },
    {
      iconName: 'Wrench',
      title: 'Central Machine Shop & Manufacturing Lab',
      description:
        'A cornerstone of the department, the Machine Shop provides a rigorous introduction to industrial manufacturing processes and precision engineering.',
      keyLabel: 'Key Equipment',
      keyItems:
        'Industrial-grade Lathe machines, Milling machines, Shaper machines, and Radial drilling machines.',
      focus:
        'Precision machining, tool geometry, and metal fabrication techniques.',
      displayOrder: 2,
    },
    {
      iconName: 'Hammer',
      title: 'Mechanics of Materials Lab',
      description:
        'Ensuring structural integrity is a primary duty of a mechanical engineer. This lab allows students to test the physical limits of engineering materials.',
      keyLabel: 'Key Equipment',
      keyItems:
        'Universal Testing Machine (UTM), Torsion testing machine, and Rockwell/Brinell Hardness testers.',
      focus:
        'Stress-strain analysis, tensile strength, elasticity, and material fatigue.',
      displayOrder: 3,
    },
    {
      iconName: 'PenTool',
      title: 'Engineering Drawing & CAD/CAM Studio',
      description:
        'Bridging the gap between concept and reality, our computing studio is equipped with industry-standard software for modern design.',
      keyLabel: 'Key Software',
      keyItems: 'AutoCAD, SolidWorks, and ANSYS.',
      focus:
        '2D technical drafting, 3D solid modelling, and Finite Element Analysis (FEA).',
      displayOrder: 4,
    },
    {
      iconName: 'Zap',
      title: 'Welding & Metal Joining Laboratory',
      description:
        'This lab focuses on the metallurgy and techniques of joining materials — essential for heavy industry and structural construction.',
      keyLabel: 'Key Processes',
      keyItems:
        'Electric Arc welding, Oxy-Acetylene gas welding, and TIG/MIG welding setups.',
      focus:
        'Weld pool dynamics, structural bonding, and safety protocols in fabrication.',
      displayOrder: 5,
    },
  ];
  await prisma.laboratoryLab.createMany({ data: rows });
  console.log(`✓ LaboratoryLabs seeded (${rows.length} rows)`);
}

// ════════════════════════════════════════════════════════════════
//  PHASE 6 — Content hubs (News, Events, Notices, Gallery)
//  Pattern: bulk insert when empty (idempotent). News/Notices use
//  isoDate as publishedAt + raw `date` string as displayDate.
//  Events parse the free-form `date` field where possible; null
//  date events keep eventDate=null with displayDate populated.
// ════════════════════════════════════════════════════════════════

const MONTH_PREFIXES = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
];

// Parse the legacy free-form Event date string into a DateTime if
// possible. Returns null for unparseable shapes (e.g. "2024", "20 Apr").
function parseLooseEventDate(displayDate: string | null): Date | null {
  if (!displayDate) return null;
  const m = /^(\d{1,2})\s+([A-Za-z]+)(?:,\s*(\d{4}))?$/.exec(displayDate.trim());
  if (!m) return null;
  const day = parseInt(m[1], 10);
  const monIdx = MONTH_PREFIXES.findIndex((mn) => m[2].toLowerCase().startsWith(mn));
  const year = m[3] ? parseInt(m[3], 10) : null;
  if (monIdx < 0 || year === null) return null;
  return new Date(Date.UTC(year, monIdx, day));
}

async function seedNews() {
  const count = await prisma.news.count();
  if (count > 0) {
    console.log(`✓ News already seeded (${count} rows)`);
    return;
  }
  // Source: src/lib/news-data.ts. isoDate parses cleanly; the
  // formatted `date` string is preserved as displayDate so the
  // public render is byte-identical until admin edits.
  for (const n of newsData) {
    await prisma.news.create({
      data: {
        slug:          n.slug,
        title:         n.title,
        shortTitle:    n.shortTitle,
        category:      n.category,
        publishedAt:   new Date(n.isoDate),
        displayDate:   n.date,
        summary:       n.summary,
        coverUrl:      n.cover,
        coverPublicId: null,
        // Imported typed arrays — TS won't widen the specific shape
        // ({label,value}[]) to Prisma's InputJsonObject signature
        // without a unknown bounce. Runtime values are JSON-safe.
        body:          n.body as unknown as Prisma.InputJsonValue,
        meta:          (n.meta ?? []) as unknown as Prisma.InputJsonValue,
      },
    });
  }
  console.log(`✓ News seeded (${newsData.length} rows)`);
}

async function seedEvents() {
  const count = await prisma.event.count();
  if (count > 0) {
    console.log(`✓ Events already seeded (${count} rows)`);
    return;
  }
  // Source: src/lib/events-data.ts. Best-effort date parse; rows
  // with unparseable (or null) dates keep eventDate=null and rely
  // on displayDate for the date pill. status preserved as-is.
  for (const e of eventsData) {
    await prisma.event.create({
      data: {
        slug:          e.slug,
        title:         e.title,
        shortTitle:    e.shortTitle,
        category:      e.category,
        status:        e.status,
        eventDate:     parseLooseEventDate(e.date),
        displayDate:   e.date,
        time:          e.time ?? null,
        venue:         e.venue ?? null,
        imageUrl:      e.image,
        imagePublicId: null,
        summary:       e.summary,
        description:   e.description as unknown as Prisma.InputJsonValue,
        focus:         e.focus,
        details:       (e.details ?? []) as unknown as Prisma.InputJsonValue,
        ctaLabel:      e.cta?.label ?? null,
        ctaHref:       e.cta?.href ?? null,
        ctaExternal:   e.cta?.external ?? false,
      },
    });
  }
  console.log(`✓ Events seeded (${eventsData.length} rows)`);
}

async function seedNotices() {
  const count = await prisma.notice.count();
  if (count > 0) {
    console.log(`✓ Notices already seeded (${count} rows)`);
    return;
  }
  // Source: src/lib/notices-data.ts. fileUrl points at the existing
  // /assets/notices/<slug>.<ext> so live notices keep working until
  // admin re-uploads; filePublicId=null marks them as not-yet-on-
  // Cloudinary (replacing one via admin will populate it).
  for (const n of noticesData) {
    await prisma.notice.create({
      data: {
        slug:         n.slug,
        title:        n.title,
        category:     n.category,
        department:   n.department,
        publishedAt:  new Date(n.isoDate),
        displayDate:  n.date,
        description:  n.description,
        fileUrl:      n.file,
        filePublicId: null,
        fileType:     n.fileType,
        fileName:     n.file.split('/').pop() ?? null,
      },
    });
  }
  console.log(`✓ Notices seeded (${noticesData.length} rows)`);
}

async function seedGalleryImages() {
  const count = await prisma.galleryImage.count();
  if (count > 0) {
    console.log(`✓ Gallery images already seeded (${count} rows)`);
    return;
  }
  // Source: src/lib/gallery-data.ts (programmatically generated
  // from a 27-entry dimensions array). Flat list per Decision A —
  // no albums. imagePublicId=null until admin re-uploads.
  for (let i = 0; i < galleryData.length; i++) {
    const g = galleryData[i];
    await prisma.galleryImage.create({
      data: {
        imageUrl:      g.src,
        imagePublicId: null,
        alt:           g.alt,
        width:         g.width,
        height:        g.height,
        displayOrder:  i,
      },
    });
  }
  console.log(`✓ Gallery images seeded (${galleryData.length} rows)`);
}

// ════════════════════════════════════════════════════════════════
//  PHASE 7 — Student Society + Transport (final CMS migration)
//  Pattern: count-gated bulk insert (idempotent — re-running won't
//  duplicate). Source data preserved verbatim from each *-data.ts
//  file so visual identity is byte-equivalent post-seed.
// ════════════════════════════════════════════════════════════════

async function seedAlumni() {
  const count = await prisma.alumni.count();
  if (count > 0) {
    console.log(`✓ Alumni already seeded (${count} rows)`);
    return;
  }
  for (let i = 0; i < alumniData.length; i++) {
    const a = alumniData[i];
    await prisma.alumni.create({
      data: {
        slug:          a.id,
        studentId:     a.studentId,
        name:          a.name,
        department:    a.department,
        designation:   a.designation,
        company:       a.company,
        photoUrl:      a.photo,
        photoPublicId: null,
        displayOrder:  i,
      },
    });
  }
  console.log(`✓ Alumni seeded (${alumniData.length} rows)`);
}

async function seedClubs() {
  const count = await prisma.club.count();
  if (count > 0) {
    console.log(`✓ Clubs already seeded (${count} rows)`);
    return;
  }
  for (let i = 0; i < clubsData.length; i++) {
    const c = clubsData[i];
    await prisma.club.create({
      data: {
        slug:          c.id,
        name:          c.name,
        abbreviation:  c.abbreviation,
        description:   c.description,
        imageUrl:      c.image,
        imagePublicId: null,
        displayOrder:  i,
      },
    });
  }
  console.log(`✓ Clubs seeded (${clubsData.length} rows)`);
}

async function seedFaqs() {
  const count = await prisma.faq.count();
  if (count > 0) {
    console.log(`✓ FAQs already seeded (${count} rows)`);
    return;
  }
  // displayOrder by source array index; the legacy `id: number` field
  // (1-33) was sequential anyway, so this preserves the rendered order.
  for (let i = 0; i < faqData.length; i++) {
    const q = faqData[i];
    await prisma.faq.create({
      data: {
        category:     q.category,
        question:     q.question,
        answer:       q.answer,
        displayOrder: i,
      },
    });
  }
  console.log(`✓ FAQs seeded (${faqData.length} rows)`);
}

async function seedVisitors() {
  const count = await prisma.visitor.count();
  if (count > 0) {
    console.log(`✓ Visitors already seeded (${count} rows)`);
    return;
  }
  for (let i = 0; i < visitorsData.length; i++) {
    const v = visitorsData[i];
    await prisma.visitor.create({
      data: {
        slug:          v.id,
        name:          v.name,
        role:          v.role ?? null,
        affiliation:   v.affiliation ?? null,
        photoUrl:      v.photo,
        photoPublicId: null,
        quote:         v.quote as unknown as Prisma.InputJsonValue,
        displayOrder:  i,
      },
    });
  }
  console.log(`✓ Visitors seeded (${visitorsData.length} rows)`);
}

// Best-effort 4-digit year parse from the free-form `date` field.
// Source data has shapes like "14 August 2019", "January–February 2023",
// "September 2022", "" (empty). Returns null when no 4-digit number found.
function parseYearFromDate(date: string | null | undefined): number | null {
  if (!date) return null;
  const m = /(\d{4})/.exec(date);
  if (!m) return null;
  const n = Number.parseInt(m[1], 10);
  return Number.isFinite(n) && n >= 1900 && n <= 2100 ? n : null;
}

async function seedResearchPapers() {
  const count = await prisma.researchPaper.count();
  if (count > 0) {
    console.log(`✓ Research papers already seeded (${count} rows)`);
    return;
  }
  for (let i = 0; i < researchPapersData.length; i++) {
    const p = researchPapersData[i];
    await prisma.researchPaper.create({
      data: {
        title:           p.title,
        authors:         p.authors,
        area:            p.area,
        date:            p.date && p.date.length > 0 ? p.date : null,
        publicationYear: parseYearFromDate(p.date),
        displayOrder:    i,
      },
    });
  }
  console.log(`✓ Research papers seeded (${researchPapersData.length} rows)`);
}

async function seedBusRoutes() {
  const count = await prisma.busRoute.count();
  if (count > 0) {
    console.log(`✓ Bus routes already seeded (${count} rows)`);
    return;
  }
  for (let i = 0; i < busRoutesData.length; i++) {
    const r = busRoutesData[i];
    await prisma.busRoute.create({
      data: {
        slug:           r.id,
        routeName:      r.routeName,
        busNumber:      r.busNumber,
        contact:        r.contact,
        departureTimes: r.departureTimes,
        returnTimes:    r.returnTimes,
        displayOrder:   i,
      },
    });
  }
  console.log(`✓ Bus routes seeded (${busRoutesData.length} rows)`);
}

async function seedSyllabus() {
  const count = await prisma.syllabus.count();
  if (count > 0) {
    console.log(`✓ Syllabus already seeded (${count} rows)`);
    return;
  }
  // Source: inline const in src/app/student-society/syllabus/page.tsx
  // (Postgraduate entry intentionally absent — page renders "coming soon"
  // empty state when level filter = Postgraduate).
  await prisma.syllabus.create({
    data: {
      slug:          'bsc-mechanical-engineering',
      title:         'B.Sc. in Mechanical Engineering',
      shortTitle:    'B. Sc. in Mechanical Engineering',
      department:    'Mechanical Engineering',
      level:         'Undergraduate',
      coverUrl:      '/assets/syllabus-me-cover.webp',
      coverPublicId: null,
      pdfUrl:        '/assets/syllabus-me.pdf',
      pdfPublicId:   null,
      pdfFileName:   'syllabus-me.pdf',
      summary:
        'Detailed course-by-course syllabus covering the four-year B.Sc. programme — Thermal Engineering, Design & Manufacturing, Automotive Engineering, Robotics & Automation, Materials Science, and Renewable Energy Systems.',
      displayOrder:  0,
    },
  });
  console.log('✓ Syllabus seeded (1 row)');
}

async function seedTransportLanding() {
  // Source: hardcoded JSX in src/app/transport-service/page.tsx —
  // the chrome that wraps the busRoutes grid (intro paragraph,
  // gradient banner, 3-row "Important Instructions" card).
  await prisma.transportLanding.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      introBody:
        'Sonargaon University (SU) provides a comprehensive bus service covering major routes to ensure a comfortable commute for our students and staff.',
      bannerHeading: 'Free University Bus Service',
      // HTML allowed — preserves the yellow-highlight pattern from
      // the legacy render. Same author-trust caveat as Phase 2/4/6.
      bannerBody:
        'The university provides free bus services covering major city areas and outskirts — <strong class="text-button-yellow">Mograpara</strong>, <strong class="text-button-yellow">Gauchhia</strong>, <strong class="text-button-yellow">Kadamtali</strong>, <strong class="text-button-yellow">Abdullahpur</strong>, and <strong class="text-button-yellow">Savar</strong>.',
      // Shape matches Phase 5 LaboratoryFacility `features` so the
      // FeaturesEditor admin component is reused (constraint #4).
      instructions: [
        {
          iconName: 'MapPin',
          title: 'Pick-up Points',
          description: 'Please contact the respective bus drivers/supervisors at the provided numbers to confirm your specific pick-up location and exact time.',
        },
        {
          iconName: 'Sparkles',
          title: 'Special Service — Mohakhali',
          description: 'A dedicated bus leaves for Mohakhali from SU six days a week at <strong>08:00 AM</strong>. For details, contact: <a href="tel:01958642587">01958-642587</a>.',
        },
        {
          iconName: 'Bus',
          title: 'Free Service',
          description: 'The university provides free bus services covering major city areas and outskirts like Mograpara, Gauchhia, Kadamtali, Abdullahpur, and Savar.',
        },
      ] as unknown as Prisma.InputJsonValue,
    },
  });
  console.log('✓ TransportLanding seeded');
}

async function main() {
  console.log('Seeding database…\n');
  await seedDepartmentIdentity();
  await seedUniversityIdentity();
  await seedPrograms();
  await seedResearchAreas();
  await seedFaculty();
  await bootstrapSuperAdmin();

  console.log('\nPhase 3 chrome structure…');
  await backfillDepartmentIdentityAlts();
  await backfillFeaturedResearchArea();
  await seedTopLinks();
  await seedQuickAccessItems();
  await seedMainNav();
  await seedFooterUsefulLinks();
  await seedFooterGetInTouchLinks();
  await seedFooterQuickLinks();
  await seedFooterLegalLinks();

  console.log('\nPhase 4 about pages…');
  await seedAboutOverview();
  await seedAboutMissionVision();
  await seedAboutMechaClub();

  console.log('\nPhase 5 lab systems…');
  await seedLabFacilityLanding();
  await seedLabs();
  await seedLaboratoryFacilityLanding();
  await seedLaboratoryLabs();

  console.log('\nPhase 6 content hubs…');
  await seedNews();
  await seedEvents();
  await seedNotices();
  await seedGalleryImages();

  console.log('\nPhase 7 student society + transport…');
  await seedAlumni();
  await seedClubs();
  await seedFaqs();
  await seedVisitors();
  await seedResearchPapers();
  await seedBusRoutes();
  await seedSyllabus();
  await seedTransportLanding();

  console.log('\nDone.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
