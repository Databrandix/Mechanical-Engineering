'use client';

import { FormEvent, useState } from 'react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';

type FormState = 'idle' | 'submitting' | 'submitted';

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const reset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
    setState('idle');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState('submitting');
    // Simulated submission — backend not wired yet.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setState('submitted');
  };

  if (state === 'submitted') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <CheckCircle2 size={28} className="text-emerald-600" />
        </div>
        <h3 className="font-display text-2xl font-bold text-primary mb-2">
          Thanks for reaching out!
        </h3>
        <p className="text-gray-600 text-[15px] leading-relaxed max-w-md mx-auto mb-6">
          Your message has been received locally. Email delivery is being set up — for now please also reach us at{' '}
          <a href="mailto:info@su.edu.bd" className="text-accent font-semibold hover:underline">
            info@su.edu.bd
          </a>
          .
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-2.5 border border-gray-200 hover:border-accent hover:text-accent text-gray-700 text-sm font-semibold rounded-md transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  const isSubmitting = state === 'submitting';

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 lg:p-10"
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full name" required>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isSubmitting}
            placeholder="Your name"
            className={inputClass}
          />
        </Field>

        <Field label="Email" required>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
            placeholder="you@example.com"
            className={inputClass}
          />
        </Field>

        <Field label="Phone" hint="Optional">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isSubmitting}
            placeholder="+8801XXXXXXXXX"
            className={inputClass}
          />
        </Field>

        <Field label="Subject" required>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            disabled={isSubmitting}
            placeholder="What is this regarding?"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Message" required>
          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            disabled={isSubmitting}
            placeholder="Tell us a bit more about your inquiry..."
            className={`${inputClass} resize-y min-h-[120px]`}
          />
        </Field>
      </div>

      <div className="mt-7 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-[12px] text-gray-500">
          We typically respond within 1–2 business days.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-gradient-to-r from-primary to-accent hover:brightness-110 text-white font-semibold rounded-md shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={16} />
              Send message
            </>
          )}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  'w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition disabled:bg-gray-50 disabled:text-gray-500';

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 mb-1.5 text-[13px] font-semibold text-primary">
        {label}
        {required && <span className="text-accent">*</span>}
        {hint && <span className="text-[11px] text-gray-400 font-normal">({hint})</span>}
      </span>
      {children}
    </label>
  );
}

