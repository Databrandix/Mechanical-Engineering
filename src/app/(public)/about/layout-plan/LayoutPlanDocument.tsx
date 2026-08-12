'use client';

import Image from 'next/image';
import { Download, ExternalLink } from 'lucide-react';
import { withAttachmentDownload } from '@/lib/pdf-helpers';

export interface LayoutPlanItem {
  slug: string;
  title: string;
  shortTitle: string;
  cover: string;
  pdf: string;
}

export default function LayoutPlanDocument({ items }: { items: LayoutPlanItem[] }) {
  return (
    <div className="flex justify-center">
      {items.map((item) => (
        <article
          key={item.slug}
          className="flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="bg-gray-50">
            {/* A hint for the space to hold before the picture arrives, not a
                size to force — `h-auto` keeps whatever shape the cover has. */}
            <Image
              src={item.cover}
              alt={item.title}
              width={600}
              height={800}
              sizes="(min-width: 640px) 50vw, 100vw"
              className="block h-auto w-full"
            />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h3 className="font-display mb-1 text-base leading-snug font-bold text-primary md:text-lg">
              {item.shortTitle}
            </h3>
            {item.pdf ? (
              <div className="mt-4 flex flex-col gap-2.5">
                <a
                  href={item.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                >
                  <ExternalLink size={16} />
                  View Layout
                </a>
                <a
                  href={withAttachmentDownload(item.pdf)}
                  download
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-primary bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  <Download size={16} />
                  Download
                </a>
              </div>
            ) : (
              <span className="mt-4 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-md bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-400">
                PDF coming soon
              </span>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
