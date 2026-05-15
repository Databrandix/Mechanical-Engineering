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
import { prisma } from '../src/lib/db';

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

async function main() {
  console.log('Seeding database…\n');
  await seedDepartmentIdentity();
  await seedUniversityIdentity();
  await seedPrograms();
  await seedResearchAreas();
  await bootstrapSuperAdmin();
  console.log('\nDone.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
