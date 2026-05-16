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

  console.log('\nDone.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
