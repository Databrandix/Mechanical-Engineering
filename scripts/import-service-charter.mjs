/**
 * The department's Service Charter, transcribed from its own document.
 *
 *   node --env-file=.env scripts/import-service-charter.mjs <path to the charter PDF>
 *
 * Seeding, not a sync: rows are written once and the admin panel owns them
 * afterwards, so re-running leaves an edited section alone rather than
 * restoring the wording it replaced. Pass --replace to overwrite everything
 * deliberately.
 *
 * The PDF is copied in as a bundled asset, named after a hash of its
 * contents — Next.js serves public/ as immutable for a year, so a charter
 * replaced at the same path would never reach anyone who had already opened
 * the old one.
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const [, , pdfArg] = process.argv;
const REPLACE = process.argv.includes('--replace');

if (!pdfArg) {
  console.error('usage: node --env-file=.env scripts/import-service-charter.mjs <path to the charter PDF>');
  process.exit(1);
}
if (!existsSync(pdfArg)) {
  console.error(`No such file: ${pdfArg}`);
  process.exit(1);
}

const prisma = new PrismaClient();
const PDF_STEM = 'service-charter-me';

const INTRO =
  'How the department works, and what you can expect from it: the services it provides, who is responsible for each, how long things take, and how to raise a concern.';

/** `groups` rows hold one item per line — the shape HeadingBodyListEditor edits. */
const g = (heading, items) => ({ heading, body: items.join('\n') });

const SECTIONS = [
  {
    serial: 1,
    title: 'Purpose',
    paragraphs: [
      'The Department of Mechanical Engineering is committed to providing high-quality academic, administrative, research, and student support services in a transparent, timely, and professional manner. This Service Charter defines the standards of service, responsibilities, communication channels, and expected timelines for departmental operations.',
    ],
    bullets: [],
    groups: [],
  },
  {
    serial: 2,
    title: 'Vision',
    paragraphs: [
      'To become a center of excellence in mechanical engineering education, research, innovation, and industry collaboration.',
    ],
    bullets: [],
    groups: [],
  },
  {
    serial: 3,
    title: 'Mission',
    paragraphs: [],
    bullets: [
      'Deliver quality engineering education.',
      'Promote research and innovation.',
      'Develop competent and ethical engineers.',
      'Foster collaboration with industry and society.',
      'Ensure efficient and student-centered administrative services.',
    ],
    groups: [],
  },
  {
    serial: 4,
    title: 'Core Values',
    paragraphs: [],
    bullets: [
      'Integrity',
      'Professionalism',
      'Transparency',
      'Accountability',
      'Excellence',
      'Inclusiveness',
      'Respect',
      'Innovation',
    ],
    groups: [],
  },
  {
    serial: 5,
    title: 'Scope of Services',
    paragraphs: ['The department provides services in the following areas:'],
    bullets: [],
    groups: [
      g('Academic Services', [
        'Undergraduate academic administration',
        'Postgraduate academic administration',
        'Course registration support',
        'Academic advising and class scheduling',
        'Examination management',
        'Result processing',
        'Curriculum implementation',
        'Student attendance monitoring',
      ]),
      g('Research Services and Supervision', [
        'Laboratory research support',
        'Thesis and project management',
        'Research seminar coordination',
      ]),
      g('Laboratory Services', [
        'Laboratory scheduling and maintenance',
        'Equipment allocation',
        'Safety management',
        'Technical assistance',
      ]),
      g('Administrative Services', [
        'Leave recommendations',
        'Internship coordination',
        'Industrial training',
        'Document verification',
      ]),
      g('Student Development Services', [
        'Academic counseling',
        'Career guidance',
        'Higher study consultation',
        'Innovation support',
        'Competition facilitation',
        'Student club supervision',
        'Alumni coordination',
      ]),
    ],
  },
  {
    serial: 6,
    title: 'Departmental Responsibilities',
    paragraphs: ['The Department shall:'],
    bullets: [
      'Ensure uninterrupted academic activities.',
      'Maintain quality teaching standards.',
      'Conduct examinations fairly.',
      'Preserve student academic records.',
      'Maintain laboratories safely.',
      'Encourage research and innovation.',
      'Provide timely administrative support.',
      'Respond to student queries professionally.',
      'Promote ethical conduct.',
      'Maintain confidentiality of records.',
    ],
    groups: [],
  },
  {
    serial: 7,
    title: 'Organizational Responsibilities',
    paragraphs: [],
    bullets: [],
    groups: [
      g('Head of Department (HoD)', [
        'Overall departmental administration',
        'Academic leadership',
        'Resource management',
        'Faculty supervision',
        'Student welfare',
        'Budget management',
        'External collaboration',
        'Quality assurance',
        'Approval of departmental documents',
      ]),
      g('Undergraduate Program Coordinator', [
        'Academic advising',
        'Registration monitoring',
        'Course scheduling',
        'Academic progress monitoring',
        'Graduation eligibility verification',
      ]),
      g('Laboratory Coordinator', [
        'Laboratory scheduling',
        'Equipment maintenance',
        'Safety compliance',
        'Laboratory inventory',
      ]),
      g('Examination Coordinator', [
        'Examination schedules',
        'Question paper collection',
        'Invigilation arrangements',
        'Result compilation',
        'Grade submission',
      ]),
      g('Faculty Members', [
        'Teaching assigned courses',
        'Student advising',
        'Research supervision',
        'Assessment',
        'Academic mentoring',
        'Laboratory supervision',
      ]),
      g('Department Office Staff', [
        'Student records',
        'File management',
        'Official correspondence',
        'Certificate processing',
        'Visitor assistance',
        'Administrative support',
      ]),
    ],
  },
  {
    serial: 8,
    title: 'Service Standards',
    /* The table itself lives in ServiceStandard and is rendered here by the
       page; this section carries only its lead line. */
    paragraphs: ['What the department will do, and by when.'],
    bullets: [],
    groups: [],
  },
  {
    serial: 9,
    title: 'Student Support Guidelines',
    paragraphs: ['The Department is committed to supporting students through:'],
    bullets: [],
    groups: [
      g('Academic Support', [
        'Academic advising',
        'Remedial guidance',
        'Course planning',
        'Graduation planning',
        'Examination preparation',
      ]),
      g('Personal Support', [
        'Counseling referral',
        'Financial aid guidance',
        'Mental health referral',
        'Special needs assistance',
      ]),
      g('Career Support', [
        'Internship opportunities',
        'Career counseling',
        'Industry networking',
        'CV review',
        'Interview preparation',
        'Higher study guidance',
      ]),
      g('Research Support', [
        'Project supervision',
        'Laboratory access',
        'Research funding guidance',
        'Publication support',
      ]),
    ],
  },
  {
    serial: 10,
    title: 'Communication Channels',
    paragraphs: ['Students and stakeholders may communicate through:'],
    bullets: [],
    groups: [
      g('Department Office', ['Walk-in during office hours', 'Telephone', 'Official email']),
      g('Faculty Members', ['Office consultation hours', 'Email', 'Scheduled appointments']),
      g('Department Website', [
        'Academic notices',
        'Forms',
        'Academic calendar',
        'Laboratory schedules',
        'Faculty directory',
      ]),
      g('Learning Management System (LMS)', [
        'Course materials',
        'Assignments',
        'Announcements',
        'Grades',
        'Discussion forums',
      ]),
      g('Official Social Media (where applicable)', [
        'Notices',
        'Events',
        'Seminar announcements',
        'Emergency updates',
      ]),
    ],
  },
  {
    serial: 11,
    title: 'Student Responsibilities',
    paragraphs: ['Students are expected to:'],
    bullets: [
      'Attend classes regularly.',
      'Follow departmental regulations.',
      'Maintain academic integrity.',
      'Respect faculty, staff, and fellow students.',
      'Use laboratory facilities safely.',
      'Meet deadlines.',
      'Keep personal records updated.',
      'Communicate respectfully.',
      'Protect university property.',
    ],
    groups: [],
  },
  {
    serial: 12,
    title: 'Complaint and Grievance Handling',
    paragraphs: [],
    bullets: [],
    groups: [
      g('Students may raise concerns regarding', [
        'Academic issues',
        'Administrative delays',
        'Laboratory services',
        'Faculty consultation',
        'Examination matters',
        'Facilities',
        "Harassment or discrimination (through the university's designated procedures)",
      ]),
      g('Complaint process', [
        'Submit the complaint in writing or through the designated online system.',
        'The department acknowledges receipt within 2 working days.',
        'An investigation is conducted by the appropriate authority.',
        'The decision is communicated within 10 working days, where feasible.',
        "If unresolved, the matter may be referred to the Faculty Dean or the university's grievance committee according to institutional policy.",
      ]),
    ],
  },
  {
    serial: 13,
    title: 'Quality Assurance',
    paragraphs: ['The Department will:'],
    bullets: [
      'Review service performance regularly.',
      'Conduct student satisfaction surveys.',
      'Monitor response times.',
      'Improve administrative efficiency.',
      'Review curriculum periodically.',
      'Encourage stakeholder feedback.',
      'Ensure continuous improvement.',
    ],
    groups: [],
  },
  {
    serial: 14,
    title: 'Service Commitments',
    paragraphs: ['The Department commits to:'],
    bullets: [
      'Treat every student with dignity and fairness.',
      'Provide services without discrimination.',
      'Maintain confidentiality of personal information.',
      'Respond promptly to inquiries.',
      'Deliver accurate and reliable information.',
      'Ensure transparency in academic and administrative decisions.',
      'Continuously improve service quality based on feedback and institutional goals.',
    ],
    groups: [],
  },
  {
    serial: 15,
    title: 'Review of the Service Charter',
    paragraphs: [
      'This Service Charter should be reviewed at least once every three years, or earlier if required by changes in university policies, accreditation requirements, or stakeholder needs.',
      'Amendments shall be approved by the Department Academic Committee and the appropriate university authority before implementation.',
    ],
    bullets: [],
    groups: [],
  },
];

const STANDARDS = [
  ['General inquiry', 'Department Office', 'Immediate or within 1 working day'],
  ['Bonafide / Student Certificate', 'Department Office', '2 working days'],
  ['Recommendation Letter', 'HoD / Concerned Faculty', '3 working days'],
  ['Internship Letter', 'Department Office', '3 working days'],
  ['Course Registration Assistance', 'UG Coordinator', 'During registration period'],
  ['Academic Transcript Recommendation', 'Department Office', '3 working days'],
  ['Leave Application Processing', 'HoD / Concerned Faculty', '2 working days'],
  ['Research Proposal Review', 'Research Committee', '10 working days'],
  ['Laboratory Booking', 'Laboratory Coordinator', '2 working days'],
  ['Equipment Issue', 'Laboratory Staff', 'Same day'],
  ['Thesis Submission Clearance', 'Department Committee', '5 working days'],
  ['Degree Clearance Recommendation', 'Department Office', '5 working days'],
  ['Complaint Response', 'HoD / Concerned Faculty', 'Within 5 working days'],
];

async function pruneOlder(dir, stem, keep) {
  const pattern = new RegExp(`^${stem}(-[0-9a-f]{8})?\\.pdf$`);
  for (const name of await readdir(dir)) {
    if (name !== keep && pattern.test(name)) {
      await unlink(path.join(dir, name));
      console.log(`  removed stale ${name}`);
    }
  }
}

async function main() {
  const existingSections = await prisma.serviceCharterSection.count();
  if (existingSections > 0 && !REPLACE) {
    console.log(`  sections: ${existingSections} already in the database — left alone`);
  } else {
    await prisma.$transaction([
      prisma.serviceCharterSection.deleteMany({}),
      prisma.serviceCharterSection.createMany({
        data: SECTIONS.map((s, i) => ({ ...s, displayOrder: i + 1 })),
      }),
    ]);
    console.log(`  sections: wrote ${SECTIONS.length}`);
  }

  const existingStandards = await prisma.serviceStandard.count();
  if (existingStandards > 0 && !REPLACE) {
    console.log(`  standards: ${existingStandards} already in the database — left alone`);
  } else {
    await prisma.$transaction([
      prisma.serviceStandard.deleteMany({}),
      prisma.serviceStandard.createMany({
        data: STANDARDS.map(([service, responsibleOffice, processingTime], i) => ({
          service,
          responsibleOffice,
          processingTime,
          displayOrder: i + 1,
        })),
      }),
    ]);
    console.log(`  standards: wrote ${STANDARDS.length}`);
  }

  const assets = path.join(process.cwd(), 'public', 'assets');
  await mkdir(assets, { recursive: true });
  const pdf = await readFile(pdfArg);
  const hash = createHash('sha256').update(pdf).digest('hex').slice(0, 8);
  const pdfFile = `${PDF_STEM}-${hash}.pdf`;
  await writeFile(path.join(assets, pdfFile), pdf);
  await pruneOlder(assets, PDF_STEM, pdfFile);

  const landing = {
    intro: INTRO,
    pdfUrl: `/assets/${pdfFile}`,
    pdfFileName: 'SU-ME-Service-Charter.pdf',
  };
  const before = await prisma.serviceCharterLanding.findUnique({ where: { id: 'singleton' } });
  await prisma.serviceCharterLanding.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton', ...landing },
    /* The intro is editable in the admin panel; only the document moves on a
       re-run, so a reworded intro survives a new charter being published. */
    update: before ? { pdfUrl: landing.pdfUrl, pdfFileName: landing.pdfFileName } : landing,
  });

  console.log(`copied ${path.basename(pdfArg)} → public/assets/${pdfFile}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
