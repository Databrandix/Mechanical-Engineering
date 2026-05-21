import type { NextConfig } from 'next';

// Phase 19 CP19.3 — security response headers applied to every route.
// COEP intentionally omitted: it would require every cross-origin
// resource (Cloudinary images, Google Fonts) to send a permissive
// CORP header, which they don't, so enabling it would break image
// loading site-wide. CSP added separately in CP19.6.
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options',    value: 'nosniff' },
  { key: 'X-Frame-Options',           value: 'DENY' },
  { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value:
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), ' +
      'magnetometer=(), gyroscope=(), accelerometer=(), interest-cohort=()',
  },
  { key: 'X-DNS-Prefetch-Control',         value: 'on' },
  { key: 'Cross-Origin-Opener-Policy',     value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy',   value: 'same-origin' },
];

const nextConfig: NextConfig = {
  // Phase 19 CP19.3 — strip the default "X-Powered-By: Next.js"
  // header so attackers can't fingerprint the framework from a
  // simple HEAD request.
  poweredByHeader: false,
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      // Cloudinary CDN — admin CMS uploads land here (folder isolation
      // via CLOUDINARY_UPLOAD_FOLDER); covers any cloud name so clones
      // for sibling departments don't need a config tweak.
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Security headers — applied to every route. Next.js merges
      // headers across matching rules, so the cache rules above keep
      // their Cache-Control while picking up this set as well.
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
