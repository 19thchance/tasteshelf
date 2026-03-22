'use client';

import { type FormEvent, type RefObject } from 'react';
import {
  motion,
  type TargetAndTransition,
  type Transition,
} from 'motion/react';

export const LAYOUT_TRANSITION = {
  duration: 0.4,
  ease: [0.16, 1, 0.3, 1],
} satisfies Transition;

const STEP_TRANSITION = {
  duration: 0.2,
  ease: 'easeOut',
} satisfies Transition;

export const STEP_ENTER_ANIMATION = {
  opacity: 1,
  x: 0,
  transition: STEP_TRANSITION,
} satisfies TargetAndTransition;

export const DELAYED_STEP_ENTER_ANIMATION = {
  opacity: 1,
  x: 0,
  transition: {
    delay: 0.1,
    ...STEP_TRANSITION,
  },
} satisfies TargetAndTransition;

export const STEP_EXIT_ANIMATION = {
  pointerEvents: 'none' as const,
  opacity: 0,
  x: -4,
  transition: STEP_TRANSITION,
} satisfies TargetAndTransition;

export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const handleStepSubmit = (
  event: FormEvent<HTMLFormElement>,
  canSubmit: boolean,
  onSubmit: () => void,
) => {
  event.preventDefault();

  if (!canSubmit) {
    return;
  }

  onSubmit();
};

export function SubmitButton({
  disabled,
  label,
  loading = false,
  onLoadingComplete,
}: {
  disabled: boolean;
  label: string;
  loading?: boolean;
  onLoadingComplete?: () => void;
}) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="w-full h-11 mt-2.5 bg-white relative overflow-hidden border border-black enabled:hover:underline disabled:opacity-40 disabled:cursor-not-allowed transition-opacity duration-200 ease-out"
    >
      {loading && (
        <motion.div
          className="absolute inset-0 bg-[#f5f5f5] origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          onAnimationComplete={onLoadingComplete}
        />
      )}
      <span className="relative">{label}</span>
    </button>
  );
}

export function EmailStep({
  email,
  canSubmitEmail,
  onEmailChange,
  onSubmit,
}: {
  email: string;
  canSubmitEmail: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <motion.div
      key="email"
      className="w-full flex flex-col gap-5 shrink-0"
      initial={{ opacity: 0, x: 4 }}
      animate={DELAYED_STEP_ENTER_ANIMATION}
      exit={STEP_EXIT_ANIMATION}
    >
      <form
        className="w-full flex flex-col gap-5"
        onSubmit={(event) =>
          handleStepSubmit(event, canSubmitEmail, onSubmit)
        }
      >
        <div className="w-full flex flex-col gap-1">
          <p>enter your email</p>
          <small className="block text-ellipsis overflow-hidden whitespace-nowrap">
            we&apos;ll send a one-time code
          </small>
        </div>
        <input
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          className="w-full bg-transparent"
          autoFocus
        />
        <SubmitButton disabled={!canSubmitEmail} label="continue" />
      </form>
    </motion.div>
  );
}

export function CodeStep({
  email,
  code,
  canSubmitCode,
  isVerifying,
  codeInputRef,
  moveCodeCaretToEnd,
  onCodeChange,
  onSubmit,
  onLoadingComplete,
}: {
  email: string;
  code: string;
  canSubmitCode: boolean;
  isVerifying: boolean;
  codeInputRef: RefObject<HTMLInputElement | null>;
  moveCodeCaretToEnd: () => void;
  onCodeChange: (value: string) => void;
  onSubmit: () => void;
  onLoadingComplete: () => void;
}) {
  return (
    <motion.div
      key="code"
      className="w-full flex flex-col gap-5 shrink-0"
      initial={{ opacity: 0, x: 4 }}
      animate={DELAYED_STEP_ENTER_ANIMATION}
      exit={STEP_EXIT_ANIMATION}
    >
      <form
        className="w-full flex flex-col gap-5"
        onSubmit={(event) =>
          handleStepSubmit(event, canSubmitCode && !isVerifying, onSubmit)
        }
      >
        <div className="flex flex-col gap-1 w-full">
          <p>confirm your email</p>
          <small className="block leading-4 break-all">sent to {email}</small>
        </div>
        <div className="w-full">
          <div className="relative w-full">
            <input
              ref={codeInputRef}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(event) =>
                onCodeChange(event.target.value.replace(/\D/g, '').slice(0, 6))
              }
              onFocus={moveCodeCaretToEnd}
              onClick={moveCodeCaretToEnd}
              className="w-full h-full absolute inset-0 opacity-0 cursor-text"
              aria-label="verification code"
              autoFocus
            />
            <div className="h-[72px] flex items-center justify-center gap-1.5 pointer-events-none select-none">
              {Array.from({ length: 6 }, (_, index) => {
                const digit = code[index];
                const isFilled = Boolean(digit);

                return (
                  <div
                    key={index}
                    className="w-5 h-full flex items-center justify-center"
                  >
                    {isFilled ? (
                      <span className="text-xl leading-none tabular-nums">
                        {digit}
                      </span>
                    ) : (
                      <span className="w-1 h-1 block bg-black" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <SubmitButton
          disabled={!canSubmitCode}
          label="verify"
          loading={isVerifying}
          onLoadingComplete={onLoadingComplete}
        />
      </form>
    </motion.div>
  );
}
