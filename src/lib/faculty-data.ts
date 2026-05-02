export type FacultyType = 'leadership' | 'full-time' | 'part-time';

/**
 * Flexible section content. A section can be:
 *  - a plain paragraph (string)
 *  - a simple bullet list (string[])
 *  - grouped lists with subheadings ({ heading, items }[])
 */
export type SectionContent =
  | string
  | string[]
  | { heading: string; items: string[] }[];

export interface Faculty {
  slug: string;
  name: string;
  designation: string;
  /** Used by leadership cards above the name (e.g. "Dean", "Head of Department"). */
  badge?: string;
  /** Optional second line under the designation (e.g. "Professor"). */
  secondaryTitle?: string;
  type: FacultyType;
  photo?: string;
  email?: string;
  suId?: string;
  phone?: string;

  // Detail sections — optional, fill in as content arrives.
  personalInfo?: { label: string; value: string }[];
  academicQualification?: SectionContent;
  trainingExperience?: SectionContent;
  teachingArea?: SectionContent;
  publications?: SectionContent;
  research?: SectionContent;
  awards?: SectionContent;
  membership?: SectionContent;
  previousEmployment?: SectionContent;
}

const DEPARTMENT = 'Department of Mechanical Engineering';

export const faculty: Faculty[] = [
  // ───── Leadership ─────
  {
    slug: 'habibur-rahman-kamal',
    name: 'Brig. Gen. (Retd) Prof. Habibur Rahman Kamal, ndc, psc',
    designation: 'Dean, Faculty of Science & Engineering',
    badge: 'Dean',
    type: 'leadership',
    photo: '/assets/faculty-dean-kamal.png',
  },
  {
    slug: 'mostofa-hossain',
    name: 'Prof. Md. Mostofa Hossain',
    designation: 'Head, Department of Mechanical Engineering',
    secondaryTitle: 'Professor',
    badge: 'Head of Department',
    type: 'leadership',
    photo: '/assets/faculty-head-mostofa.png',
    email: 'mosto1956@gmail.com',
    suId: 'SU1603141114',
    phone: '01955529729',

    personalInfo: [
      { label: 'Name', value: 'Prof. Md. Mostofa Hossain' },
      { label: 'Designation', value: 'Professor' },
      { label: 'Department', value: 'Mechanical Engineering' },
      { label: 'Faculty', value: 'Faculty of Science & Engineering' },
      { label: 'Contact', value: '01955529729' },
    ],

    academicQualification: [
      'SSC Certification — Passing Year: 1972 | Group: Science | School: Mohadevpur High School',
      'HSC Certification — Passing Year: 1981 | Group: Mechanical Technology | College: Rajshahi Polytechnic Institute',
      'Honours Certification — Passing Year: 1989 | Group: Mechanical Engineering | University: DUET (Former BIT, Dhaka)',
      'Masters Certification — Passing Year: 2003 | Group: Mechanical Engineering | University: BUET, Dhaka',
    ],

    trainingExperience: [
      {
        heading: 'Training at Home',
        items: [
          'Successfully completed training on Industrial Control and Mechatronics (19–22 January 2003), Directorate of Continuing Education, BUET.',
          'Successfully completed training on Industrial & Control Applications of Basic Pneumatics and Basic Electro-Pneumatics (22–27 April 2006), Green Field Automation Technologies Ltd., Dhaka.',
          'Successfully completed National Training Session in the field of Vocational and Technical Training (26–28 May 2009).',
          'Successfully completed training on Green Composites (21 December 2011), BUET & Tuskegee University, USA.',
          'Successfully completed training on Multimedia Class Room and Digital Content Development (14–19 September 2013).',
          'Successfully completed training on Teaching on Active Learning (05–07 January 2017).',
        ],
      },
      {
        heading: 'Training Abroad',
        items: [
          'Successfully completed training in the field of Welding (12 May – 25 June 1994), South Korea.',
          'Successfully completed Managerial Training on Head of the Department (05–15 December 2015), Singapore.',
        ],
      },
    ],

    teachingArea: 'No information provided on the website.',

    publications: [
      {
        heading: 'Journals',
        items: [
          'Thermal Performance Analysis of Thermal Energy Storage Tank using Solid Rocks with HITEC Salt (2022).',
          'Performance Analysis of Biodiesel Generated Continuously by using Newly Developed PLC Processor (2021).',
          'An Experimental Study of Passive Flow Separation Control by Backward Facing Step with Different Aspect Ratios of NACA 0012 Wing (2021).',
          'An Experimental Investigation of the Effect of Aspect Ratio on the Airfoil Characteristics of NACA 0012 Wing (2020).',
          'A Review on Renovation of Gas Turbine to Improve Efficiency using Compressor Water Wash (2017).',
          'Scenario of Safety Issues Prevailing Accident in Rural Engineering Workshop in Bangladesh (2017).',
          'Study of Natural Convection Heat Transfer in a Rectangular Enclosure from One Cooled Side Wall (2017).',
          'Numerical Simulation of Non-Newtonian Spiral Flow Through Stenosed Artery with 75% and 96% Area Reductions (2017).',
          'Improvement of Conventional Electric Heater to Reduce Energy Loss and Its Performance Test (2016).',
          'A Comparative Study of Performances of Different Types of Barrier Constructions for Attenuating Low Frequency Noise (2016).',
        ],
      },
      {
        heading: 'Books',
        items: [
          'Hossain, M. M. — Basic Workshop Practice-1 (MT-113), 1st Edition, Boi Bitan Publication, Bangla Bazar, Dhaka.',
        ],
      },
    ],

    research: [
      {
        heading: 'Field of Interest',
        items: ['Thermofluid Engineering', 'Energy Engineering'],
      },
    ],

    awards: 'No information provided on the website.',

    membership: ['Fellow IEB — F08561'],

    previousEmployment: 'No information provided on the website.',
  },

  // ───── Full-time faculty (#2–30 from the SU list) ─────
  {
    slug: 'amm-shamsul-alam', name: 'AMM Shamsul Alam', designation: 'Associate Professor',
    type: 'full-time', photo: '/assets/faculty-shamsul-alam.png',
    email: 'ammshamsul@gmail.com', suId: 'SU2301064638', phone: '01769005367',
  },
  {
    slug: 'ahatashamul-haque-khan-shuvo', name: 'Md. Ahatashamul Haque Khan Shuvo', designation: 'Assistant Professor',
    type: 'full-time', photo: '/assets/faculty-ahatashamul-haque-khan-shuvo.png',
    email: 'mahskhan.khan@gmail.com', suId: 'SU1808301292', phone: '01955529728',
  },
  {
    slug: 'saikat-biswas', name: 'Saikat Biswas', designation: 'Assistant Professor',
    type: 'full-time', photo: '/assets/faculty-saikat-biswas.png',
    email: 'saikatbiswas.kuet@gmail.com', suId: 'SU1808301294', phone: '01955529747',
  },
  {
    slug: 'minhaz-uddin', name: 'Md. Minhaz Uddin', designation: 'Assistant Professor',
    type: 'full-time', photo: '/assets/faculty-minhaz-uddin.png',
    email: 'minhazuddin137@gmail.com', suId: 'SU1901061311', phone: '01827630584',
  },
  {
    slug: 'niloy-sarkar', name: 'Niloy Sarkar', designation: 'Assistant Professor',
    type: 'full-time', photo: '/assets/faculty-niloy-sarkar.png',
    email: 'niloy24sumechanical@gmail.com', suId: 'SU1901171326', phone: '01955529829',
  },
  {
    slug: 'nuruzzaman-rakib', name: 'Nuruzzaman Rakib', designation: 'Assistant Professor',
    type: 'full-time', photo: '/assets/faculty-nuruzzaman-rakib.png',
    email: 'rakibzaman1463@gmail.com', suId: 'SU1902261336', phone: '01955529752',
  },
  {
    slug: 'shahinur-rahman', name: 'Shahinur Rahman', designation: 'Lecturer & Course Coordinator',
    type: 'full-time', photo: '/assets/faculty-shahinur-rahman.png',
    email: 'shahinursu2020@gmail.com', suId: 'SU2002261393', phone: '01958642411',
  },
  {
    slug: 'faisal-junaeat-imrul', name: 'M. A. Faisal Junaeat Imrul', designation: 'Lecturer & Assistant Coordinator',
    type: 'full-time', photo: '/assets/faculty-faisal-junaeat-imrul.png',
    email: 'junaetfaisal@gmail.com', suId: 'SU2109012368', phone: '01700936248',
  },
  {
    slug: 'navid-inan', name: 'Md. Navid Inan', designation: 'Lecturer',
    type: 'full-time', photo: '/assets/faculty-navid-inan.png',
    email: 'navidinan.su@gmail.com', suId: 'SU2201011020', phone: '01958642475',
  },
  {
    slug: 'misbah-uddin', name: 'Md. Misbah Uddin', designation: 'Lecturer',
    type: 'full-time', photo: '/assets/faculty-misbah-uddin.jpg',
    email: 'mdmisbahuddin99@gmail.com', suId: 'SU2201011024', phone: '01836414499',
  },
  {
    slug: 'ismail-hossain', name: 'G M Ismail Hossain', designation: 'Lecturer',
    type: 'full-time', photo: '/assets/faculty-ismail-hossain.png',
    email: 'gmismail016@gmail.com', suId: 'SU2205101113', phone: '01958642572',
  },
  {
    slug: 'nahiyan-chowdhury', name: 'Nahiyan Chowdhury', designation: 'Lecturer',
    type: 'full-time', photo: '/assets/faculty-nahiyan-chowdhury.png',
    email: 'nahiyanchowdhury22@gmail.com', suId: 'SU2208024537', phone: '01719987789',
  },
  {
    slug: 'washif-rahman', name: 'M. I. Washif Rahman', designation: 'Lecturer',
    type: 'full-time', photo: '/assets/faculty-washif-rahman.png',
    email: 'washif.me@gmail.com', suId: 'SU2208024540', phone: '01818060447',
  },
  {
    slug: 'khandoker-mohammad-faisal-karim', name: 'Khandoker Mohammad Faisal Karim', designation: 'Lecturer',
    type: 'full-time', photo: '/assets/faculty-khandoker-mohammad-faisal-karim.jpg',
    suId: 'SU2209054559',
  },
  {
    slug: 'hasan-tareq-mahin', name: 'Hasan Tareq Mahin', designation: 'Lecturer',
    type: 'full-time', photo: '/assets/faculty-hasan-tareq-mahin.png',
    email: 'hasantareq.me.su.22@gmail.com', suId: 'SU2209054566', phone: '01521408094',
  },
  {
    slug: 'rokiya-sultana', name: 'Rokiya Sultana', designation: 'Lecturer',
    type: 'full-time', photo: '/assets/faculty-rokiya-sultana.png',
    email: 'rokaiyasultana016@gmail.com', suId: 'SU2209274599', phone: '01627542002',
  },
  {
    slug: 'ibrahim-khalil-apurba', name: 'Ibrahim Khalil Apurba', designation: 'Lecturer',
    type: 'full-time', photo: '/assets/faculty-ibrahim-khalil-apurba.png',
    email: 'iamibrahim83@gmail.com', suId: 'SU2305084698', phone: '01957781158',
  },
  {
    slug: 'torikul-islam', name: 'Md. Torikul Islam', designation: 'Lecturer',
    type: 'full-time', photo: '/assets/faculty-torikul-islam.png',
    email: 'torikruetme46@gmail.com', suId: 'SU2305084700', phone: '01957113357',
  },
  {
    slug: 'munkasir-ahnaf-jisba', name: 'Munkasir Ahnaf Jisba', designation: 'Lecturer',
    type: 'full-time', photo: '/assets/faculty-munkasir-ahnaf-jisba.png',
    email: 'munkasirahnaf@proton.me', suId: 'SU2306074717', phone: '01860971800',
  },
  {
    slug: 'faruque-hossain', name: 'Md. Faruque Hossain', designation: 'Lecturer & Assistant Coordinator',
    type: 'full-time', photo: '/assets/faculty-faruque-hossain.png',
    email: 'faruque.su@gmail.com', suId: 'SU2307074726', phone: '01955529875',
  },
  {
    slug: 'kazi-maskawath', name: 'Kazi Maskawath', designation: 'Lecturer',
    type: 'full-time', photo: '/assets/faculty-kazi-maskawath.png',
    email: 'kmayon13@gmail.com', suId: 'SU2309014747', phone: '01732827089',
  },
  {
    slug: 'sadman-hossain', name: 'Md. Sadman Hossain', designation: 'Lecturer',
    type: 'full-time', photo: '/assets/faculty-sadman-hossain.png',
    email: 'sadmanhossainravin98@gmail.com', suId: 'SU2309014748', phone: '01675387100',
  },
  {
    slug: 'towheedur-rahman-tanvir', name: 'Md. Towheedur Rahman Tanvir', designation: 'Lecturer',
    type: 'full-time', photo: '/assets/faculty-towheedur-rahman-tanvir.png',
    email: 'tanviribnlutfor.su@gmail.com', suId: 'SU2407054882', phone: '01303039919',
  },
  {
    slug: 'farhan-kadir-rafi', name: 'Farhan Kadir Rafi', designation: 'Lecturer',
    type: 'full-time', photo: '/assets/faculty-farhan-kadir-rafi.png',
    email: 'farhankadir33@gmail.com', suId: 'SU2407054883', phone: '01827204025',
  },
  {
    slug: 'tahmid-hasan-oni', name: 'Tahmid Hasan Oni', designation: 'Lecturer',
    type: 'full-time', photo: '/assets/faculty-tahmid-hasan-oni.png',
    email: 'tahmidoni70@gmail.com', suId: 'SU2407054884', phone: '01684837712',
  },
  {
    slug: 'nafis-iqbal', name: 'Nafis Iqbal', designation: 'Lecturer',
    type: 'full-time', photo: '/assets/faculty-nafis-iqbal.png',
    email: 'nafis.iqbal.su@gmail.com', suId: 'SU2407054885', phone: '01771551725',
  },
  {
    slug: 'mahfuz-kabir', name: 'Md. Mahfuz Kabir', designation: 'Lecturer',
    type: 'full-time', photo: '/assets/faculty-mahfuz-kabir.png',
    email: 'mahfuzkabir.su@gmail.com', suId: 'SU2407054886', phone: '01749352466',
  },
  {
    slug: 'shafi-uddin-bhuiyan', name: 'Shafi Uddin Bhuiyan', designation: 'Lecturer',
    type: 'full-time', photo: '/assets/faculty-shafi-uddin-bhuiyan.png',
    suId: 'SU2408134898', phone: '01707516365',
  },
  {
    slug: 'mahfujul-islam', name: 'Md. Mahfujul Islam', designation: 'Lecturer',
    type: 'full-time', photo: '/assets/faculty-mahfujul-islam.png',
  },

  // ───── Full-time extras (no contact info supplied yet) ─────
  {
    slug: 'khakan-hasan-mim', name: 'Md. Khakan Hasan Mim', designation: 'Lecturer & Exam Coordinator',
    type: 'full-time', photo: '/assets/faculty-khakan-hasan-mim.png',
  },
  {
    slug: 'biplob-hossain', name: 'Biplob Hossain', designation: 'Lecturer',
    type: 'full-time', photo: '/assets/faculty-biplob-hossain.png',
  },
  {
    slug: 'feroze-alam', name: 'Md. Feroze Alam', designation: 'Lecturer',
    type: 'full-time', photo: '/assets/faculty-feroze-alam.png',
  },

  // ───── Part-time faculty ─────
  {
    slug: 'abul-bashar', name: 'Prof. Md. Abul Bashar', designation: 'Professor (Part-time)',
    type: 'part-time',
    email: 'prof.bashar@gmail.com', suId: 'SU2402184795', phone: '01713049085',
  },
  {
    slug: 'mohammad-ali', name: 'Prof. Dr. Mohammad Ali', designation: 'Professor, BUET (Part-time)',
    type: 'part-time',
    email: 'mali@me.buet.ac.bd', suId: 'SU1303090100', phone: '01732194776',
  },
  {
    slug: 'arefin-kowser', name: 'Prof. Dr. Md. Arefin Kowser', designation: 'Professor, DUET (Part-time)',
    type: 'part-time',
    email: 'arefin@duet.ac.bd', suId: 'SU1303090123', phone: '01754262832',
  },
  {
    slug: 'jalal-uddin', name: 'Dr. Md. Jalal Uddin', designation: 'Assistant Professor (Part-time)',
    type: 'part-time',
    email: 'jalal_bitac@yahoo.com', suId: 'SU2201011052', phone: '01923618189',
  },
  {
    slug: 'nasir-uddin', name: 'Md. Nasir Uddin', designation: 'Lecturer (Part-time)',
    type: 'part-time',
    email: 'nasiruddinsumon001@gmail.com', suId: 'SU1801040550', phone: '01767751838',
  },
  {
    slug: 'anash-mia', name: 'Md. Anash Mia', designation: 'Lecturer (Contractual)',
    type: 'part-time', photo: '/assets/faculty-anash-mia.png',
    email: 'anas108.kuet@gmail.com', suId: 'SU2305174709', phone: '01779763212',
  },
];

export const getFacultyBySlug = (slug: string): Faculty | undefined =>
  faculty.find((f) => f.slug === slug);

export const facultyByType = (type: FacultyType): Faculty[] =>
  faculty.filter((f) => f.type === type);

export const departmentName = DEPARTMENT;
