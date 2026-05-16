'use client';

import { useRef, useState } from 'react';
import { ImageOff, X } from 'lucide-react';
import { toast } from 'sonner';

type Kind =
  | 'department-logo'
  | 'department-hero'
  | 'university-logo'
  | 'program-image'
  | 'research-icon'
  | 'faculty-photo'
  | 'faculty-message-hero';

type Props = {
  /** Which folder + transformation hint the upload goes to. */
  kind: Kind;
  /** Base name for the two hidden inputs: `${name}Url` and `${name}PublicId`. */
  name: string;
  initialUrl?: string | null;
  initialPublicId?: string | null;
  label?: string;
  aspectRatio?: 'square' | 'wide' | 'auto';
};

export default function ImageUploader({
  kind,
  name,
  initialUrl,
  initialPublicId,
  label,
  aspectRatio = 'auto',
}: Props) {
  const [url, setUrl] = useState<string>(initialUrl ?? '');
  const [publicId, setPublicId] = useState<string>(initialPublicId ?? '');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      // 1. Get signed Cloudinary params from our server
      const signRes = await fetch('/api/admin/uploads/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind }),
      });
      if (!signRes.ok) {
        const data = await signRes.json().catch(() => ({}));
        throw new Error(data.error ?? 'Failed to sign upload');
      }
      const sign = await signRes.json();

      // 2. Upload directly to Cloudinary
      const fd = new FormData();
      fd.append('file', file);
      fd.append('api_key', sign.apiKey);
      fd.append('timestamp', String(sign.timestamp));
      fd.append('folder', sign.folder);
      fd.append('signature', sign.signature);
      const upRes = await fetch(sign.uploadUrl, { method: 'POST', body: fd });
      if (!upRes.ok) {
        throw new Error('Cloudinary upload failed');
      }
      const upJson = await upRes.json();

      setUrl(upJson.secure_url);
      setPublicId(upJson.public_id);
      toast.success('Image uploaded');
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function clearImage() {
    if (publicId) {
      // Best-effort cleanup of the now-orphaned Cloudinary asset.
      try {
        await fetch('/api/admin/uploads/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId }),
        });
      } catch {
        /* swallow — orphan cleanup is best-effort */
      }
    }
    setUrl('');
    setPublicId('');
  }

  const aspectClass =
    aspectRatio === 'square' ? 'aspect-square' :
    aspectRatio === 'wide'   ? 'aspect-[3/1]' : '';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <div
        className={`relative bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg overflow-hidden ${aspectClass}`}
      >
        {url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt=""
              className={`w-full ${aspectRatio === 'auto' ? 'max-h-40 object-contain' : 'h-full object-cover'}`}
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-1.5 shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
            <ImageOff size={24} />
            <span className="text-xs mt-1">No image</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={uploading}
          className="text-sm text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border file:border-gray-200 file:bg-white file:text-gray-700 file:text-sm file:font-medium hover:file:bg-gray-50 file:cursor-pointer"
        />
        {uploading && (
          <span className="text-xs text-gray-500 animate-pulse">Uploading…</span>
        )}
      </div>
      <input type="hidden" name={`${name}Url`} value={url} />
      <input type="hidden" name={`${name}PublicId`} value={publicId} />
    </div>
  );
}
