import { z } from 'zod';

// Hex color in #RRGGBB form
const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a #RRGGBB hex color');

// Cloudinary public_id is opaque string; the URL is normally an https URL
// but we keep both as plain strings so locally-seeded assets (e.g.
// /assets/hero-1.webp) remain valid until first upload.
const nullableString = z.string().nullable();
const optionalNullableString = z.string().nullable().optional();

// ─────────────────────────────────────────────────────────────────
//  DepartmentIdentity (singleton — PUT only; GET takes no body)
// ─────────────────────────────────────────────────────────────────

export const departmentUpdateSchema = z.object({
  name:            z.string().min(1).max(200),
  shortCode:       z.string().min(1).max(20),
  facultyName:     z.string().min(1).max(200),
  primaryColor:    hexColor,
  accentColor:     hexColor,
  buttonColor:     hexColor,
  logoUrl:         z.string().min(1),
  logoPublicId:    nullableString,
  breadcrumbLabel: z.string().min(1).max(50),
  heroImage1Url:   z.string().min(1),
  heroImage1PublicId: nullableString,
  heroImage2Url:   z.string().min(1),
  heroImage2PublicId: nullableString,
  heroImage3Url:   z.string().min(1),
  heroImage3PublicId: nullableString,
});

// ─────────────────────────────────────────────────────────────────
//  UniversityIdentity (singleton)
// ─────────────────────────────────────────────────────────────────

const urlOrEmpty = z.string().url().or(z.literal('')).nullable();

export const universityUpdateSchema = z.object({
  name:    z.string().min(1).max(300),
  address: z.string().min(1),
  phones:  z.array(z.string().min(1)).default([]),
  emails:  z.array(z.string().email()).default([]),
  facebookUrl:  urlOrEmpty,
  instagramUrl: urlOrEmpty,
  youtubeUrl:   urlOrEmpty,
  linkedinUrl:  urlOrEmpty,
  xUrl:         urlOrEmpty,
  tiktokUrl:    urlOrEmpty,
  whatsappUrl:  urlOrEmpty,
  threadsUrl:   urlOrEmpty,
  erpUrl:       urlOrEmpty,
  applyUrl:     urlOrEmpty,
  libraryUrl:   urlOrEmpty,
  iqacUrl:      urlOrEmpty,
  careerUrl:    urlOrEmpty,
  noticeUrl:    urlOrEmpty,
  copyrightText: z.string().min(1).max(500),
  mapEmbedUrl:   z.string().nullable(),
  logoUrl:       z.string().min(1),
  logoPublicId:  nullableString,
});

// ─────────────────────────────────────────────────────────────────
//  Program (list — CRUD + reorder)
// ─────────────────────────────────────────────────────────────────

export const programCreateSchema = z.object({
  programName:     z.string().min(1).max(300),
  degreeCode:      z.string().min(1).max(50),
  duration:        z.string().min(1).max(100),
  description:     z.string().min(1),
  displayOrder:    z.number().int().min(0).optional(), // auto-append if omitted
  imageUrl:        optionalNullableString,
  imagePublicId:   optionalNullableString,
  specializations: z.array(z.string()).default([]),
  cta:             z.string().nullable().optional(),
});

export const programUpdateSchema = programCreateSchema.partial();

export const reorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

// ─────────────────────────────────────────────────────────────────
//  ResearchArea (list — CRUD + reorder)
// ─────────────────────────────────────────────────────────────────

// Base shape — kept un-refined so we can derive both create + update
// from the same source of truth without poking at Zod internals.
const researchAreaBaseShape = z.object({
  iconName:     z.string().min(1).nullable().optional(),
  iconPublicId: z.string().min(1).nullable().optional(),
  iconUrl:      z.string().min(1).nullable().optional(),
  areaName:     z.string().min(1).max(200),
  description:  z.string().nullable().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const researchAreaCreateSchema = researchAreaBaseShape.refine(
  (v) => {
    const lucide = !!v.iconName;
    const uploaded = !!v.iconPublicId && !!v.iconUrl;
    return (lucide ? 1 : 0) + (uploaded ? 1 : 0) === 1;
  },
  {
    message:
      'Provide exactly one of: iconName (Lucide), or (iconPublicId + iconUrl) (uploaded image).',
  },
);

export const researchAreaUpdateSchema = researchAreaBaseShape.partial().refine(
  (v: Partial<z.infer<typeof researchAreaBaseShape>>) => {
    const lucideProvided = v.iconName !== undefined;
    const uploadProvided = v.iconPublicId !== undefined && v.iconUrl !== undefined;
    if (!lucideProvided && !uploadProvided) return true;
    const lucide = !!v.iconName;
    const uploaded = !!v.iconPublicId && !!v.iconUrl;
    return (lucide ? 1 : 0) + (uploaded ? 1 : 0) === 1;
  },
  {
    message:
      'When updating the icon, provide exactly one source: iconName, or (iconPublicId + iconUrl).',
  },
);

// ─────────────────────────────────────────────────────────────────
//  Admin user management
// ─────────────────────────────────────────────────────────────────

export const Role = z.enum(['super_admin', 'admin']);

export const userCreateSchema = z.object({
  email:    z.string().email(),
  name:     z.string().min(1).max(100),
  password: z.string().min(8).max(128),
  role:     Role.default('admin'),
});

export const userUpdateSchema = z.object({
  name:     z.string().min(1).max(100).optional(),
  role:     Role.optional(),
  isActive: z.boolean().optional(),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8).max(128),
});

export const changeRoleSchema = z.object({
  role: Role,
});

export const changeOwnPasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword:     z.string().min(8).max(128),
});

// ─────────────────────────────────────────────────────────────────
//  Faculty (Phase 2 — list, CRUD, reorder)
// ─────────────────────────────────────────────────────────────────

// Prisma enum identifiers — underscored (no hyphens allowed).
export const FacultyType = z.enum(['leadership', 'full_time', 'part_time']);

// SectionContent — string | string[] | { heading, items }[]
const sectionContentSchema = z.union([
  z.string(),
  z.array(z.string()),
  z.array(
    z.object({ heading: z.string(), items: z.array(z.string()).default([]) }),
  ),
]);

// PersonalInfo — array of label/value rows
const personalInfoSchema = z.array(
  z.object({ label: z.string().min(1), value: z.string().min(1) }),
);

const slugRegex = /^[a-z0-9-]+$/;

export const facultyCreateSchema = z.object({
  slug:           z.string().min(1).max(120).regex(slugRegex, 'Slug must be lowercase letters, numbers, and hyphens only'),
  name:           z.string().min(1).max(300),
  designation:    z.string().min(1).max(300),
  secondaryTitle: z.string().max(300).nullable().optional(),
  badge:          z.string().max(100).nullable().optional(),
  type:           FacultyType,
  displayOrder:   z.number().int().min(0).optional(),

  photoUrl:       optionalNullableString,
  photoPublicId:  optionalNullableString,

  email:          z.string().email().nullable().optional().or(z.literal('')),
  phone:          z.string().nullable().optional(),
  suId:           z.string().nullable().optional(),

  personalInfo:          personalInfoSchema.nullable().optional(),
  academicQualification: sectionContentSchema.nullable().optional(),
  trainingExperience:    sectionContentSchema.nullable().optional(),
  teachingArea:          sectionContentSchema.nullable().optional(),
  publications:          sectionContentSchema.nullable().optional(),
  research:              sectionContentSchema.nullable().optional(),
  awards:                sectionContentSchema.nullable().optional(),
  membership:            sectionContentSchema.nullable().optional(),
  previousEmployment:    sectionContentSchema.nullable().optional(),

  isDean:                   z.boolean().optional().default(false),
  isHead:                   z.boolean().optional().default(false),
  messageOverline:          z.string().nullable().optional(),
  messageHeading:           z.string().nullable().optional(),
  messageParagraphs:        z.array(z.string()).optional().default([]),
  messagePhotoUrl:          optionalNullableString,
  messagePhotoPublicId:     optionalNullableString,
  messageTitleLine1:        z.string().nullable().optional(),
  messageTitleLine2:        z.string().nullable().optional(),
  messageHeroImageUrl:      optionalNullableString,
  messageHeroImagePublicId: optionalNullableString,
  messageHeroImagePosition: z.string().nullable().optional(),
});

export const facultyUpdateSchema = facultyCreateSchema.partial();

// ─────────────────────────────────────────────────────────────────
//  Cloudinary upload helpers
// ─────────────────────────────────────────────────────────────────

// public_id is opaque; required when deleting an asset.
export const cloudinaryDeleteSchema = z.object({
  publicId: z.string().min(1),
});

// Asset kind controls the folder + transformation hint at upload time.
export const uploadKindSchema = z.enum([
  'department-logo',
  'department-hero',
  'university-logo',
  'program-image',
  'research-icon',
  'faculty-photo',
  'faculty-message-hero',
]);

export const uploadSignSchema = z.object({
  kind: uploadKindSchema,
});
