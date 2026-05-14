'use client';

import { useActionState, useEffect, useState } from 'react';
import type { DepartmentIdentity } from '@prisma/client';
import { toast } from 'sonner';
import ImageUploader from '@/components/admin/ImageUploader';
import {
  updateDepartmentAction,
  type ActionResult,
} from '@/lib/admin-actions/department';

type Initial = DepartmentIdentity | null;
type State = ActionResult | { ok: null };

export default function DepartmentForm({ initial }: { initial: Initial }) {
  const [state, formAction, pending] = useActionState<State, FormData>(
    updateDepartmentAction,
    { ok: null },
  );

  useEffect(() => {
    if (state.ok === true) toast.success('Department identity saved');
    if (state.ok === false) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      {/* ─── Naming ─── */}
      <Card title="Naming">
        <TextField label="Department name" name="name"
                   defaultValue={initial?.name ?? ''} required />
        <div className="grid grid-cols-2 gap-4">
          <TextField label="Short code" name="shortCode"
                     defaultValue={initial?.shortCode ?? ''} required />
          <TextField label="Breadcrumb label" name="breadcrumbLabel"
                     defaultValue={initial?.breadcrumbLabel ?? ''} required />
        </div>
        <TextField label="Faculty name" name="facultyName"
                   defaultValue={initial?.facultyName ?? ''} required />
      </Card>

      {/* ─── Brand colors ─── */}
      <Card title="Brand colors">
        <div className="grid grid-cols-3 gap-4">
          <ColorField label="Primary"
                      name="primaryColor"
                      defaultValue={initial?.primaryColor ?? '#2B3175'} />
          <ColorField label="Accent"
                      name="accentColor"
                      defaultValue={initial?.accentColor ?? '#CC1579'} />
          <ColorField label="Button"
                      name="buttonColor"
                      defaultValue={initial?.buttonColor ?? '#F8BD23'} />
        </div>
      </Card>

      {/* ─── Logo ─── */}
      <Card title="Logo">
        <ImageUploader
          kind="department-logo"
          name="logo"
          initialUrl={initial?.logoUrl}
          initialPublicId={initial?.logoPublicId}
        />
      </Card>

      {/* ─── Hero images ─── */}
      <Card title="Hero images (3)">
        <ImageUploader kind="department-hero" name="heroImage1" aspectRatio="wide"
                       label="Hero #1"
                       initialUrl={initial?.heroImage1Url}
                       initialPublicId={initial?.heroImage1PublicId} />
        <ImageUploader kind="department-hero" name="heroImage2" aspectRatio="wide"
                       label="Hero #2"
                       initialUrl={initial?.heroImage2Url}
                       initialPublicId={initial?.heroImage2PublicId} />
        <ImageUploader kind="department-hero" name="heroImage3" aspectRatio="wide"
                       label="Hero #3"
                       initialUrl={initial?.heroImage3Url}
                       initialPublicId={initial?.heroImage3PublicId} />
      </Card>

      {/* ─── Errors + submit ─── */}
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
  label, name, defaultValue, required, type = 'text',
}: {
  label: string; name: string; defaultValue?: string; required?: boolean; type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </label>
      <input id={name} name={name} type={type}
             defaultValue={defaultValue}
             required={required}
             className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent" />
    </div>
  );
}

function ColorField({
  label, name, defaultValue,
}: { label: string; name: string; defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input type="color" id={name} name={name} value={value}
               onChange={(e) => setValue(e.target.value)}
               className="w-12 h-10 border border-gray-300 rounded cursor-pointer" />
        <span className="font-mono text-xs text-gray-600 bg-gray-50 border border-gray-200 px-2 py-1 rounded select-all">
          {value.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
