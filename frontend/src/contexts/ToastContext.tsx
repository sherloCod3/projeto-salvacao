'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, X, ChevronDown, ChevronUp } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error';

export interface ToastPayload {
  /** Short, friendly message shown to the end-user in large text. */
  user: string;
  /**
   * Optional technical details shown in a collapsed monospace section.
   * Visible to devs / power-users who expand it.
   */
  dev?: string;
}

interface ToastItem extends ToastPayload {
  id: number;
  variant: ToastVariant;
}

interface ToastContextValue {
  /** Fire a success toast with optional dev details. */
  success: (payload: ToastPayload) => void;
  /** Fire an error toast with optional dev details. */
  error: (payload: ToastPayload) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * useToast — access the toast dispatcher from any client component.
 * Must be used inside <ToastProvider>.
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

// ─── Individual Toast Card ────────────────────────────────────────────────────

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const [devOpen, setDevOpen] = useState(false);
  const isSuccess = item.variant === 'success';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className={`
        relative w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden
        backdrop-blur-xl border
        ${isSuccess
          ? 'bg-green-950/80 border-green-500/30 shadow-green-500/10'
          : 'bg-red-950/80 border-red-500/30 shadow-red-500/10'
        }
      `}
    >
      {/* Accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isSuccess ? 'bg-green-400' : 'bg-red-400'}`} />

      <div className="pl-4 pr-3 pt-3 pb-3">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 shrink-0 ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
            {isSuccess ? <CheckCircle size={20} /> : <XCircle size={20} />}
          </div>
          <p className="flex-1 text-sm font-semibold text-white leading-snug">{item.user}</p>
          <button
            onClick={onDismiss}
            className="shrink-0 text-white/40 hover:text-white/80 transition-colors"
            aria-label="Fechar notificação"
          >
            <X size={16} />
          </button>
        </div>

        {/* Dev details — collapsed by default */}
        {item.dev && (
          <div className="mt-2 pl-8">
            <button
              onClick={() => setDevOpen(o => !o)}
              className={`flex items-center gap-1 text-xs font-mono transition-colors
                ${isSuccess ? 'text-green-500 hover:text-green-300' : 'text-red-500 hover:text-red-300'}`}
            >
              {devOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {devOpen ? 'ocultar detalhes' : 'detalhes técnicos'}
            </button>
            <AnimatePresence>
              {devOpen && (
                <motion.pre
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mt-1 text-[10px] font-mono leading-relaxed whitespace-pre-wrap break-all overflow-hidden
                    ${isSuccess ? 'text-green-300/70' : 'text-red-300/70'}`}
                >
                  {item.dev}
                </motion.pre>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Provider ────────────────────────────────────────────────────────────────

/**
 * ToastProvider — wraps the app and renders the toast stack in a fixed portal.
 * Place this in the root layout so toasts are available everywhere.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const add = useCallback((variant: ToastVariant, payload: ToastPayload) => {
    const id = ++counter.current;
    setToasts(prev => [...prev, { id, variant, ...payload }]);
    // Auto-dismiss after 6s
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 6000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const value: ToastContextValue = {
    success: (p) => add('success', p),
    error: (p) => add('error', p),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Fixed toast stack — bottom-right on desktop, bottom-center on mobile */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end w-full max-w-sm pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(item => (
            <div key={item.id} className="pointer-events-auto w-full">
              <ToastCard item={item} onDismiss={() => dismiss(item.id)} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
