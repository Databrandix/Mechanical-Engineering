/**
 * Cloudinary serves an uploaded PDF inline, so a "Download" link on one opens
 * the browser's reader instead of saving the file. `flags=attachment` asks for
 * it as a download. Bundled files under /assets are served by this app and
 * honour the anchor's own `download`, so they are returned untouched.
 */
export function withAttachmentDownload(url: string): string {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url + (url.includes('?') ? '&' : '?') + 'flags=attachment';
}
