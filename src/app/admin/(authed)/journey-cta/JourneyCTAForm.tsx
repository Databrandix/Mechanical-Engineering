'use client';

import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { JourneyCTAContent } from '@prisma/client';
import ImageUploader from '@/components/admin/ImageUploader';
import {
  updateJourneyCTAContentAction,
  type ActionResult,
} from '@/lib/admin-actions/journey-cta';

type State = ActionResult | { ok: null };

// Convert a stored CSS object-position string ("center 32%") to the
// 0-100 number the vertical-position slider uses. Defensive parse —
// anything we can't read falls back to 50 (visual center).
function parsePositionPercent(value: string | null | undefined): number {
  if (!value) return 50;
  const match = value.match(/(\d+)\s*%/);
  if (!match) return 50;
  const n = Number(match[1]);
  if (!Number.isFinite(n)) return 50;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export default function JourneyCTAForm({ initial }: { initial: JourneyCTAContent | null }) {
  const [state, formAction, pending] = useActionState<State, FormData>(
    updateJourneyCTAContentAction,
    { ok: null },
  );

  // Vertical position slider — 0 = top edge visible, 100 = bottom
  // edge visible. Persisted to DB as `center {N}%`.
  const [verticalPercent, setVerticalPercent] = useState<number>(
    parsePositionPercent(initial?.heroImagePosition),
  );

  useEffect(() => {
    if (state.ok === true) toast.success('Journey CTA saved');
    if (state.ok === false) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      <Card title="Hero image">
        <ImageUploader
          kind="journey-cta-hero"
          name="heroImage"
          aspectRatio="wide"
          label="Background image"
          initialUrl={initial?.heroImageUrl}
          initialPublicId={initial?.heroImagePublicId}
        />

        <div>
          <label htmlFor="heroVerticalPercent"
                 className="block text-sm font-medium text-gray-700 mb-1">
            Image vertical position
          </label>
          <div className="flex items-center gap-3">
            <input
              id="heroVerticalPercent"
              type="range"
              min={0}
              max={100}
              step={1}
              value={verticalPercent}
              onChange={(e) => setVerticalPercent(Number(e.target.value))}
              className="flex-1 accent-accent cursor-pointer"
            />
            <input
              type="number"
              min={0}
              max={100}
              step={1}
              value={verticalPercent}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (Number.isFinite(n)) setVerticalPercent(Math.max(0, Math.min(100, Math.round(n))));
              }}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center"
              aria-label="Vertical position percent"
            />
            <span className="text-xs text-gray-500">%</span>
          </div>
          <p className="mt-1.5 text-xs text-gray-500">
            Drag the slider to move the image up or down within the banner. 0 = top edge of the image visible, 100 = bottom edge visible. Try different values to frame the people / subject correctly.
          </p>
          {/* Hidden input serializes the slider value to the CSS form
              the public renderer + DB use. */}
          <input
            type="hidden"
            name="heroImagePosition"
            value={`center ${verticalPercent}%`}
          />
        </div>
      </Card>

      <Card title="Content">
        <TextField label="Heading" name="heading" required
                   defaultValue={initial?.heading ?? ''}
                   placeholder="Shape Your Future with Excellence" />
        <TextAreaField label="Body (HTML allowed)" name="body" required rows={3}
                       defaultValue={initial?.body ?? ''}
                       placeholder="Join a vibrant academic community..." />
      </Card>

      <Card title="Primary CTA — left button">
        <TextField label="Button label" name="primaryCtaLabel" required
                   defaultValue={initial?.primaryCtaLabel ?? ''}
                   placeholder="Apply Now" />
        <TextField label="Link URL" name="primaryCtaHref" required
                   defaultValue={initial?.primaryCtaHref ?? ''}
                   placeholder="https://... or /apply" />
        <CheckboxField label="Opens in new tab (external link)"
                       name="primaryCtaExternal"
                       defaultChecked={initial?.primaryCtaExternal ?? true} />
      </Card>

      <Card title="Secondary CTA — right button (outlined)">
        <TextField label="Button label" name="secondaryCtaLabel" required
                   defaultValue={initial?.secondaryCtaLabel ?? ''}
                   placeholder="Request for Information" />
        <TextField label="Link URL" name="secondaryCtaHref" required
                   defaultValue={initial?.secondaryCtaHref ?? ''}
                   placeholder="/contact" />
        <CheckboxField label="Opens in new tab (external link)"
                       name="secondaryCtaExternal"
                       defaultChecked={initial?.secondaryCtaExternal ?? false} />
      </Card>

      {state.ok === false && (
        <div role="alert"
             className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.error}
        </div>
      )}

      <div className="flex justify-end">
        <button type="submit" disabled={pending}
                className="bg-primary hover:bg-primary/90 text-white font-medium rounded-lg px-5 py-2.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent/40">
          {pending ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">{title}</h2>
      {children}
    </section>
  );
}

function TextField({
  label, name, defaultValue, required, placeholder,
}: { label: string; name: string; defaultValue?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </label>
      <input id={name} name={name} type="text"
             defaultValue={defaultValue} required={required} placeholder={placeholder}
             className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent" />
    </div>
  );
}

function TextAreaField({
  label, name, defaultValue, required, rows = 3, placeholder,
}: { label: string; name: string; defaultValue?: string; required?: boolean; rows?: number; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </label>
      <textarea id={name} name={name}
                defaultValue={defaultValue} required={required} rows={rows} placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-y" />
    </div>
  );
}

function CheckboxField({
  label, name, defaultChecked,
}: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="inline-flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
      <input type="checkbox" name={name} defaultChecked={defaultChecked}
             className="mt-0.5 w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent/50" />
      <span>{label}</span>
    </label>
  );
}
