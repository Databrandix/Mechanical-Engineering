import { v2 as cloudinary } from 'cloudinary';
import { ApiError } from './auth-server';

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new ApiError(
      500,
      `Server misconfigured: ${name} is not set. Cloudinary uploads disabled.`,
    );
  }
  return v;
}

let configured = false;

function ensureConfigured() {
  if (configured) return;
  cloudinary.config({
    cloud_name: required('CLOUDINARY_CLOUD_NAME'),
    api_key:    required('CLOUDINARY_API_KEY'),
    api_secret: required('CLOUDINARY_API_SECRET'),
    secure:     true,
  });
  configured = true;
}

// Folder layout: <root>/<kind>/  — per-department isolation comes from
// CLOUDINARY_UPLOAD_FOLDER, so cloning this repo for another department
// only requires changing that env var.
const KIND_TO_SUBFOLDER: Record<string, string> = {
  'department-logo':  'department/logo',
  'department-hero':  'department/hero',
  'university-logo':  'university/logo',
  'program-image':    'programs',
  'research-icon':    'research-areas',
};

function folderFor(kind: string): string {
  const root = process.env.CLOUDINARY_UPLOAD_FOLDER || 'phase-0';
  const sub  = KIND_TO_SUBFOLDER[kind] ?? 'misc';
  return `${root}/${sub}`;
}

// ─────────────────────────────────────────────────────────────────
//  Signed-upload params for browser direct-upload
// ─────────────────────────────────────────────────────────────────
//
//  Browser flow:
//   1. POST /api/admin/uploads/sign { kind } → { signature, ... }
//   2. Browser POSTs the file + these params to Cloudinary directly:
//        https://api.cloudinary.com/v1_1/<cloud_name>/auto/upload
//   3. Cloudinary returns { secure_url, public_id, ... }
//   4. Browser PUTs/POSTs that secure_url + public_id back to our
//      content route (e.g. PUT /api/admin/department).
//
//  API_SECRET never leaves the server.
//
export function signUploadParams(kind: string) {
  ensureConfigured();
  const timestamp = Math.round(Date.now() / 1000);
  const folder = folderFor(kind);

  const paramsToSign: Record<string, string | number> = {
    timestamp,
    folder,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    required('CLOUDINARY_API_SECRET'),
  );

  return {
    timestamp,
    folder,
    signature,
    apiKey:    required('CLOUDINARY_API_KEY'),
    cloudName: required('CLOUDINARY_CLOUD_NAME'),
    uploadUrl: `https://api.cloudinary.com/v1_1/${required('CLOUDINARY_CLOUD_NAME')}/auto/upload`,
  };
}

// ─────────────────────────────────────────────────────────────────
//  Server-side delete (used when an admin replaces an image and we
//  want to clean up the old asset).
// ─────────────────────────────────────────────────────────────────
export async function deleteAsset(publicId: string) {
  ensureConfigured();
  return cloudinary.uploader.destroy(publicId, { invalidate: true });
}
