'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import ConfirmDialog, { type ConfirmVariant } from './ConfirmDialog';

export type ConfirmOptions = {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
};

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

type DialogState = {
  options: Required<Pick<ConfirmOptions, 'title' | 'message'>> &
    Pick<ConfirmOptions, 'confirmLabel' | 'cancelLabel' | 'variant'>;
  resolver: (value: boolean) => void;
};

// Context-based confirmation system. Wrap the (authed) admin layout
// once and any descendant client component can `const confirm =
// useConfirm()` and await a boolean. Replaces window.confirm calls
// across the admin surface with an in-app modal (chair preference).
export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DialogState | null>(null);

  const confirm = useCallback<ConfirmFn>((opts) => {
    return new Promise<boolean>((resolve) => {
      setState({
        options: {
          title: opts.title ?? 'Are you sure?',
          message: opts.message ?? '',
          confirmLabel: opts.confirmLabel,
          cancelLabel: opts.cancelLabel,
          variant: opts.variant,
        },
        resolver: resolve,
      });
    });
  }, []);

  const handleCancel = useCallback(() => {
    setState((prev) => {
      prev?.resolver(false);
      return null;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setState((prev) => {
      prev?.resolver(true);
      return null;
    });
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <ConfirmDialog
          title={state.options.title}
          message={state.options.message}
          confirmLabel={state.options.confirmLabel}
          cancelLabel={state.options.cancelLabel}
          variant={state.options.variant}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error(
      'useConfirm must be used inside <ConfirmDialogProvider>. The admin layout already wraps it; check that the call site is under /admin/(authed).',
    );
  }
  return ctx;
}
