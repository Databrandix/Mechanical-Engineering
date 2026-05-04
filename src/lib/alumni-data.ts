export interface Alumni {
  id: string;
  name: string;
  department: string;
  designation: string;
  company: string;
  photo: string;
}

export const alumni: Alumni[] = [
  {
    id: 'mm-sarwar',
    name: 'M. M. Sarwar',
    department: 'Mechanical Engineering',
    designation: 'Senior Superintendent Instructor (Retired)',
    company: 'BUET & Sonargaon University',
    photo: '/assets/alumni/mm-sarwar.png',
  },
  {
    id: 'burhan-uddin',
    name: 'Md. Burhan Uddin',
    department: 'Mechanical Engineering',
    designation: 'Semi Skilled Maintainer',
    company: 'Dhaka Mass Transit Company Limited (DMTCL)',
    photo: '/assets/alumni/burhan-uddin.jpeg',
  },
  {
    id: 'mts-alam-ananto',
    name: 'M. T. S. Alam Ananto',
    department: 'Mechanical Engineering',
    designation: 'Assistant Engineer (Mechanical)',
    company: 'BIWTC, Ministry of Shipping',
    photo: '/assets/alumni/ananto.jpeg',
  },
  {
    id: 'salah-uddin',
    name: 'Md. Salah Uddin',
    department: 'Mechanical Engineering',
    designation: 'Junior Inspector',
    company: 'Dhaka Polytechnic Institute',
    photo: '/assets/alumni/salah-uddin.png',
  },
  {
    id: 'sabbir-hosen',
    name: 'Sabbir Hosen',
    department: 'Mechanical Engineering',
    designation: 'Executive (QEHS)',
    company: 'RAK Ceramics (Bangladesh) Limited',
    photo: '/assets/alumni/sabbir-hosen.png',
  },
  {
    id: 'sadi-emon',
    name: 'Sadi Md. Emon',
    department: 'Mechanical Engineering',
    designation: 'Junior Instructor',
    company: 'UCEP Bangladesh',
    photo: '/assets/alumni/sadi-emon.jpeg',
  },
];
