/**
 * Set a page's banner from a local picture.
 *
 *   node --env-file=.env scripts/set-page-hero.mjs \
 *     --key student-society-service-charter \
 *     --label "Service Charter" \
 *     --path /student-society/service-charter \
 *     --title "Service Charter" \
 *     --overline "Student Society" \
 *     --image "C:\path\to\photo.jpg" [--subtitle "…"] [--vertical 40]
 *
 * Pages read their banner from the PageHero row for their key and fall back
 * to a bundled campus shot when there is none. The admin panel edits rows it
 * can find; this creates one, which is the part the panel cannot do for a
 * page that has never had a banner.
 *
 * --vertical is the object-position the banner crops around. Note the
 * direction, which is easy to get backwards: a HIGHER number shows a LOWER
 * slice of the picture, so the picture appears to move UP in the frame. To
 * move the picture down, lower the number.
 *
 * Omit --image to re-crop the banner already there without re-uploading it.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function flag(name) {
  const at = process.argv.indexOf(`--${name}`);
  return at === -1 ? undefined : process.argv[at + 1];
}

const key = flag('key');
const label = flag('label');
const publicPath = flag('path');
const title = flag('title');
const image = flag('image');
const overline = flag('overline');
const subtitle = flag('subtitle');
const verticalFlag = flag('vertical');

if (!key) {
  console.error('usage: --key <pageKey> [--label …] [--path /route] [--title …] [--image <file>] [--overline …] [--subtitle …] [--vertical 0-100]');
  process.exit(1);
}
if (image && !existsSync(image)) {
  console.error(`No such file: ${image}`);
  process.exit(1);
}
if (verticalFlag !== undefined) {
  const n = Number(verticalFlag);
  if (!Number.isInteger(n) || n < 0 || n > 100) {
    console.error(`--vertical must be a whole number from 0 to 100, got "${verticalFlag}"`);
    process.exit(1);
  }
}

/**
 * Cloudinary's free plan refuses uploads over 10 MB and a camera original can
 * be well past it — the convocation photographs are 13 MB. A banner is never
 * shown above 2400px, so anything larger is re-encoded first.
 */
async function readForUpload(filePath) {
  const original = readFileSync(filePath);
  if (original.byteLength <= 9 * 1024 * 1024) {
    const extension = path.extname(filePath).toLowerCase().replace('.', '');
    return { buffer: original, mime: `image/${extension === 'jpg' ? 'jpeg' : extension || 'jpeg'}` };
  }
  const sharp = (await import('sharp')).default;
  const resized = await sharp(original)
    .rotate()
    .resize({ width: 2400, withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toBuffer();
  console.log(
    `  resized ${(original.byteLength / 1048576).toFixed(1)} MB → ${(resized.byteLength / 1048576).toFixed(1)} MB`,
  );
  return { buffer: resized, mime: 'image/jpeg' };
}

async function main() {
  const before = await prisma.pageHero.findUnique({ where: { pageKey: key } });

  if (!before && (!label || !publicPath || !title || !image)) {
    console.error(`No banner exists for "${key}" yet — creating one needs --label, --path, --title and --image.`);
    process.exit(1);
  }

  /* Re-uploading a picture that has not changed costs a slow upload for
     nothing, and adjusting the crop is the usual reason to run this twice. */
  let picture = null;
  if (image) {
    const { buffer, mime } = await readForUpload(image);
    const uploaded = await cloudinary.uploader.upload(
      `data:${mime};base64,${buffer.toString('base64')}`,
      {
        folder: `${process.env.CLOUDINARY_UPLOAD_FOLDER}/page-heroes`,
        public_id: key,
        overwrite: true,
        timeout: 120_000,
      },
    );
    picture = {
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      size: `${uploaded.width}x${uploaded.height}`,
    };
  }

  const vertical = verticalFlag !== undefined ? Number(verticalFlag) : (before?.heroImageVerticalPercent ?? 50);

  const data = {
    ...(label ? { pageLabel: label } : {}),
    ...(publicPath ? { publicPath } : {}),
    ...(title ? { heroTitle: title } : {}),
    ...(subtitle !== undefined ? { heroSubtitle: subtitle } : {}),
    ...(overline !== undefined ? { heroOverline: overline } : {}),
    ...(picture ? { heroImageUrl: picture.url, heroImagePublicId: picture.publicId } : {}),
    heroImageVerticalPercent: vertical,
  };

  /* Not an upsert: Prisma type-checks the create branch even when the row
     exists, and on an update-only run the required columns are absent by
     design. */
  const row = before
    ? await prisma.pageHero.update({ where: { pageKey: key }, data })
    : await prisma.pageHero.create({
        data: {
          pageKey: key,
          pageLabel: label,
          publicPath,
          heroTitle: title,
          heroSubtitle: subtitle ?? null,
          heroOverline: overline ?? null,
          heroImageUrl: picture.url,
          heroImagePublicId: picture.publicId,
          heroImageVerticalPercent: vertical,
        },
      });

  console.log(`${before ? 'Updated' : 'Created'} the banner for ${row.publicPath}`);
  console.log(
    picture
      ? `  uploaded ${picture.size}, cropped around ${vertical}%`
      : `  kept the existing picture, cropped around ${vertical}%`,
  );
  console.log(`  ${row.heroImageUrl}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
