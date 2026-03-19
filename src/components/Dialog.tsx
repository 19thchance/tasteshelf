'use client';

import { type FormEvent, useEffect, useRef, useState } from 'react';
import {
  animate,
  AnimatePresence,
  motion,
  MotionValue,
  TargetAndTransition,
  Transition,
  useMotionValue,
} from 'motion/react';

import { useDialog } from '../hooks/useDialogStore';
import { Action, ReviewingStep } from '../types/dialogType';

const SAMPLE_REVIEWS = [
  'pretty solid everyday pick.\nnot too sweet, which is nice.\n\nwould buy again.',
  'tastes exactly how it should.\nclean finish, no weird aftertaste.\n\ngood stuff.',
  'actually really good.\nlight and refreshing.\n\ndefinitely going in the fridge.',
  "wasn't expecting much but it hits.\nperfect for the afternoon.\n\nsolid.",
  "simple. clean.\ndoesn't try too hard.\n\na new favorite.",
  'smooth texture, great taste.\neasy to drink.\n\nwill stock up.',
  'does the job perfectly.\nnot overly artificial.\n\nnice pickup.',
  'really crisp.\nexactly what i needed today.\n\nrecommend it.',
  'surprisingly good.\nsubtle flavor, nothing crazy.\n\nworth trying.',
  'straight to the point.\ntastes great cold.\n\nwould get another.',
];
const LAYOUT_TRANSITION = {
  duration: 0.4,
  ease: [0.16, 1, 0.3, 1],
} satisfies Transition;
const STEP_TRANSITION = {
  duration: 0.2,
  ease: 'easeOut',
} satisfies Transition;
const STEP_ENTER_ANIMATION = {
  opacity: 1,
  x: 0,
  transition: STEP_TRANSITION,
} satisfies TargetAndTransition;
const DELAYED_STEP_ENTER_ANIMATION = {
  opacity: 1,
  x: 0,
  transition: {
    delay: 0.1,
    ...STEP_TRANSITION,
  },
} satisfies TargetAndTransition;
const STEP_EXIT_ANIMATION = {
  pointerEvents: 'none' as const,
  opacity: 0,
  x: -4,
  transition: STEP_TRANSITION,
} satisfies TargetAndTransition;

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const handleStepSubmit = (
  e: FormEvent<HTMLFormElement>,
  canSubmit: boolean,
  onSubmit: () => void,
) => {
  e.preventDefault();

  if (!canSubmit) return;

  onSubmit();
};

function SubmitButton({
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

export function Dialog() {
  const isReviewing = useDialog((state) => state.action === Action.Reviewing);
  const setAction = useDialog((state) => state.setAction);

  const [step, setStep] = useState<ReviewingStep>(ReviewingStep.Review);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [sampleReview, setSampleReview] = useState<string>('');
  const [canSubmitReview, setCanSubmitReview] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [innerHeight, setInnerHeight] = useState<number | 'auto'>('auto');

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const submitAnimationRef = useRef<ReturnType<typeof animate> | null>(null);
  const backup = useRef<{
    value: string;
    selectionStart: number;
    selectionEnd: number;
    height: number;
  }>({
    value: '',
    selectionStart: 0,
    selectionEnd: 0,
    height: 72,
  });

  const submitOffsetY: MotionValue<number> = useMotionValue(0);
  const canSubmitEmail: boolean = Boolean(email.trim()) && isValidEmail(email);
  const canSubmitCode: boolean = code.length === 6;

  const moveCodeCaretToEnd = () => {
    requestAnimationFrame(() => {
      if (!codeInputRef.current) return;

      const end = codeInputRef.current.value.length;

      codeInputRef.current.setSelectionRange(end, end);
    });
  };

  useEffect(() => {
    if (!isReviewing) return;

    setSampleReview(
      SAMPLE_REVIEWS[Math.floor(Math.random() * SAMPLE_REVIEWS.length)],
    );
    setCanSubmitReview(false);
    backup.current = {
      value: '',
      selectionStart: 0,
      selectionEnd: 0,
      height: 72,
    };

    if (contentRef.current) {
      contentRef.current.value = '';
      contentRef.current.style.height = '72px';
    }

    contentRef.current?.focus();
    // eslint-disable-next-line
  }, [isReviewing]);

  useEffect(() => {
    if (!innerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setInnerHeight((entry.target as HTMLElement).offsetHeight);
      }
    });

    observer.observe(innerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isReviewing && step === ReviewingStep.Review) return;

    submitAnimationRef.current?.stop();
    submitOffsetY.set(0);
  }, [isReviewing, step, submitOffsetY]);

  return (
    <div className="w-screen h-screen fixed inset-0 flex items-center justify-center z-10 pointer-events-none">
      <div
        className="w-[360px] relative pointer-events-auto"
        style={{
          transform:
            'translateX(calc(50vw - 180px - max(40px, calc((100vw - 1840px) / 2))))',
        }}
      >
        <motion.div
          className="flex flex-col gap-5"
          initial={{ opacity: 0 }}
          animate={
            isSubmitted
              ? { scale: [1, 1.03, 1], opacity: [1, 1, 0] }
              : { opacity: 1 }
          }
          exit={{ opacity: 0 }}
          transition={
            isSubmitted
              ? { duration: 0.3, times: [0, 0.4, 1], ease: 'easeOut' }
              : { duration: 0.2, ease: 'easeOut' }
          }
          onAnimationComplete={() => {
            if (!isSubmitted) return;

            setAction(null);
          }}
        >
          <motion.div
            className="w-[360px] relative bg-white border border-black overflow-hidden"
            animate={{
              height: innerHeight === 'auto' ? 'auto' : innerHeight + 2,
            }}
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div
              ref={innerRef}
              className="min-h-[174px] p-5 relative flex flex-col justify-center"
            >
              <AnimatePresence mode="wait">
                {step === ReviewingStep.Review && (
                  <motion.div
                    key="review"
                    className="w-full flex flex-col gap-5 shrink-0"
                    initial={{ opacity: 1, x: 0 }}
                    animate={STEP_ENTER_ANIMATION}
                    exit={STEP_EXIT_ANIMATION}
                  >
                    <form
                      className="w-full flex flex-col gap-5"
                      onSubmit={(e) =>
                        handleStepSubmit(e, canSubmitReview, () =>
                          setStep(ReviewingStep.Email),
                        )
                      }
                    >
                      <div className="w-full flex flex-col gap-1">
                        <p>write your review</p>
                        <small className="block text-ellipsis overflow-hidden whitespace-nowrap">
                          of Citrus Flavoured Soft Drink
                        </small>
                      </div>
                      <textarea
                        ref={contentRef}
                        className="w-full h-[72px] max-h-[180px] shrink-0 bg-transparent resize-none overflow-hidden"
                        placeholder={sampleReview}
                        rows={1}
                        onBeforeInput={() => {
                          if (!contentRef.current) return;

                          backup.current = {
                            value: contentRef.current.value,
                            selectionStart:
                              contentRef.current.selectionStart ??
                              contentRef.current.value.length,
                            selectionEnd:
                              contentRef.current.selectionEnd ??
                              contentRef.current.value.length,
                            height: contentRef.current.offsetHeight,
                          };
                        }}
                        onInput={(e) => {
                          const textarea = e.currentTarget;
                          const previousHeight = backup.current.height;
                          const nextValue = textarea.value;

                          textarea.style.height = '72px';

                          if (textarea.scrollHeight > 182) {
                            textarea.value = backup.current.value;
                            textarea.style.height = `${backup.current.height}px`;
                            textarea.setSelectionRange(
                              backup.current.selectionStart,
                              backup.current.selectionEnd,
                            );
                          } else {
                            const nextHeight = Math.max(
                              72,
                              textarea.scrollHeight,
                            );

                            textarea.style.height = `${nextHeight}px`;

                            backup.current = {
                              value: nextValue,
                              selectionStart:
                                textarea.selectionStart ?? nextValue.length,
                              selectionEnd:
                                textarea.selectionEnd ?? nextValue.length,
                              height: nextHeight,
                            };

                            const delta = nextHeight - previousHeight;

                            if (delta) {
                              submitAnimationRef.current?.stop();
                              submitOffsetY.set(submitOffsetY.get() - delta);
                              submitAnimationRef.current = animate(
                                submitOffsetY,
                                0,
                                LAYOUT_TRANSITION,
                              );
                            }
                          }

                          setCanSubmitReview((prev) => {
                            const next = Boolean(textarea.value.trim());

                            return prev === next ? prev : next;
                          });
                        }}
                      />
                      <motion.div
                        className="w-full"
                        style={{ y: submitOffsetY }}
                      >
                        <SubmitButton
                          disabled={!canSubmitReview}
                          label="submit"
                        />
                      </motion.div>
                    </form>
                  </motion.div>
                )}
                {step === ReviewingStep.Email && (
                  <motion.div
                    key="email"
                    className="w-full flex flex-col gap-5 shrink-0"
                    initial={{ opacity: 0, x: 4 }}
                    animate={DELAYED_STEP_ENTER_ANIMATION}
                    exit={STEP_EXIT_ANIMATION}
                  >
                    <form
                      className="w-full flex flex-col gap-5"
                      onSubmit={(e) =>
                        handleStepSubmit(e, canSubmitEmail, () =>
                          setStep(ReviewingStep.Code),
                        )
                      }
                    >
                      <div className="w-full flex flex-col gap-1">
                        <p>enter your email</p>
                        <small className="block text-ellipsis overflow-hidden whitespace-nowrap">
                          we'll send a one-time code
                        </small>
                      </div>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent"
                        autoFocus
                      />
                      <SubmitButton
                        disabled={!canSubmitEmail}
                        label="continue"
                      />
                    </form>
                  </motion.div>
                )}
                {step === ReviewingStep.Code && (
                  <motion.div
                    key="code"
                    className="w-full flex flex-col gap-5 shrink-0"
                    initial={{ opacity: 0, x: 4 }}
                    animate={DELAYED_STEP_ENTER_ANIMATION}
                    exit={STEP_EXIT_ANIMATION}
                  >
                    <form
                      className="w-full flex flex-col gap-5"
                      onSubmit={(e) =>
                        handleStepSubmit(e, canSubmitCode && !isVerifying, () =>
                          setIsVerifying(true),
                        )
                      }
                    >
                      <div className="flex flex-col gap-1 w-full">
                        <p>confirm your email</p>
                        <small className="block leading-4 break-all">
                          sent to {email}
                        </small>
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
                            onChange={(e) =>
                              setCode(
                                e.target.value.replace(/\D/g, '').slice(0, 6),
                              )
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
                        onLoadingComplete={() => {
                          setIsVerifying(false);
                          setIsSubmitted(true);
                        }}
                      />
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
