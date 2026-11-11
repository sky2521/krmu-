import React from 'react';
import {
  ShieldCheck,
  Lock,
  Check,
  Loader2,
  AlertCircle,
  Database,
  KeyRound,
  CreditCard,
  X
} from 'lucide-react';

const STAGE_STEPS = [
  {
    id: 'creating_order',
    title: 'Locking Vault Session',
    subtitle: 'Creating authenticated order on Razorpay REST servers',
    icon: KeyRound
  },
  {
    id: 'awaiting_gateway',
    title: 'Encrypted Authorization',
    subtitle: 'Waiting for UPI, Card, or NetBanking confirmation',
    icon: CreditCard
  },
  {
    id: 'verifying_hmac',
    title: 'HMAC-SHA256 Verification',
    subtitle: 'Cryptographic signature verification on server',
    icon: ShieldCheck
  },
  {
    id: 'persisting_database',
    title: 'Supabase Ledger Sync',
    subtitle: 'Writing order, items & payment audit record to Postgres',
    icon: Database
  }
];

const STAGE_INDEX = {
  creating_order: 0,
  awaiting_gateway: 1,
  verifying_hmac: 2,
  persisting_database: 3,
  completed: 4
};

export default function PaymentProcessingCurtain({
  isOpen,
  stage,
  error,
  amount,
  meta = {},
  onRetry,
  onLaunchFallback,
  onClose
}) {
  if (!isOpen) return null;

  const isFailed = stage === 'failed' || stage === 'sdk_unavailable';
  const currentIdx = STAGE_INDEX[stage] ?? 0;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-[#0D0D0E]/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#121214] border border-[#C5A059]/40 rounded-sm p-6 sm:p-8 text-white shadow-2xl space-y-6">
        {isFailed && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
            aria-label="Close payment overlay"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Top Emblem */}
        <div className="text-center space-y-2.5">
          <div className="mx-auto w-14 h-14 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/50 flex items-center justify-center">
            {isFailed ? (
              <AlertCircle className="w-7 h-7 text-amber-400" />
            ) : (
              <Lock className="w-6 h-6 text-[#C5A059] animate-pulse" />
            )}
          </div>

          <span className="inline-block text-[10px] uppercase tracking-[0.35em] text-[#C5A059] font-bold">
            KRMU × Razorpay Priority Vault
          </span>

          <h3 className="font-serif text-2xl sm:text-3xl font-light text-white">
            {isFailed ? 'Authorization Paused' : 'Securing Your Acquisition'}
          </h3>

          <p className="text-xs text-[#BDB7AE]">
            Total Settlement: <strong className="text-[#E6CFA0]">₹{Number(amount || 0).toLocaleString('en-IN')}</strong>
          </p>

          {meta.razorpayOrderId && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-[10px] font-mono text-[#E6CFA0]">
              <span>Gateway Order:</span>
              <span className="text-white font-semibold">{meta.razorpayOrderId}</span>
            </div>
          )}
        </div>

        {/* Pipeline Stepper */}
        <div className="space-y-3 border-y border-white/10 py-5">
          {STAGE_STEPS.map((step, idx) => {
            const StepIcon = step.icon;
            const completed = !isFailed && idx < currentIdx;
            const active = !isFailed && idx === currentIdx;

            return (
              <div
                key={step.id}
                className={`flex items-start gap-3 p-2.5 rounded-sm border transition-all ${
                  active
                    ? 'bg-[#C5A059]/12 border-[#C5A059]/60'
                    : completed
                    ? 'bg-emerald-950/30 border-emerald-500/35'
                    : 'bg-white/[0.02] border-white/10 opacity-60'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    completed
                      ? 'bg-emerald-600 text-white'
                      : active
                      ? 'bg-[#C5A059] text-[#121214]'
                      : 'bg-white/10 text-neutral-400'
                  }`}
                >
                  {completed ? (
                    <Check className="w-4 h-4" />
                  ) : active ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <StepIcon className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white">{step.title}</p>
                  <p className="text-[11px] text-neutral-400 leading-snug">{step.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error / Recovery Actions */}
        {isFailed ? (
          <div className="space-y-3">
            {error && (
              <p className="text-xs text-amber-300 bg-amber-950/40 border border-amber-500/30 p-3 rounded-sm text-center">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-2">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="w-full py-3 luxury-shimmer text-[#121214] font-bold text-xs uppercase tracking-[0.22em] rounded-sm hover:brightness-105 transition-all"
                >
                  Retry Official Razorpay Checkout
                </button>
              )}

              {onLaunchFallback && (
                <button
                  type="button"
                  onClick={onLaunchFallback}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/20 text-white text-[11px] uppercase tracking-widest rounded-sm transition-colors"
                >
                  Launch Built-In Sandbox Simulator
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-[10px] text-center text-neutral-400">
            256-Bit SSL Encrypted • Do not close or refresh this window
          </p>
        )}
      </div>
    </div>
  );
}
