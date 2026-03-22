'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { useDialog } from '../../hooks/useDialogStore';
import {
  CodeStep,
  EmailStep,
  handleStepSubmit,
  isValidEmail,
  LAYOUT_TRANSITION,
  STEP_ENTER_ANIMATION,
  STEP_EXIT_ANIMATION,
  SubmitButton,
} from '../verification/VerificationSteps';

type ListingStep = 'item' | 'email' | 'code';

export function ListingPanel() {
  const setAction = useDialog((state) => state.setAction);

  const [step, setStep] = useState<ListingStep>('item');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [itemName, setItemName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [innerHeight, setInnerHeight] = useState<number | 'auto'>('auto');

  const innerRef = useRef<HTMLDivElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  const canSubmitItem = Boolean(itemName.trim());
  const canSubmitEmail = Boolean(email.trim()) && isValidEmail(email);
  const canSubmitCode = code.length === 6;

  const moveCodeCaretToEnd = () => {
    requestAnimationFrame(() => {
      if (!codeInputRef.current) {
        return;
      }

      const end = codeInputRef.current.value.length;

      codeInputRef.current.setSelectionRange(end, end);
    });
  };

  useEffect(() => {
    if (!innerRef.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setInnerHeight((entry.target as HTMLElement).offsetHeight);
      }
    });

    observer.observe(innerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      className="top-full mt-5 absolute flex flex-col gap-5"
      initial={{ opacity: 0 }}
      animate={
        isSubmitted ? { scale: [1, 1.03, 1], opacity: [1, 1, 0] } : { opacity: 1 }
      }
      exit={{ opacity: 0 }}
      transition={
        isSubmitted
          ? { duration: 0.3, times: [0, 0.4, 1], ease: 'easeOut' }
          : { duration: 0.2, ease: 'easeOut' }
      }
      onAnimationComplete={() => {
        if (!isSubmitted) {
          return;
        }

        setAction(null);
      }}
    >
      <motion.div
        className="w-[360px] relative bg-white border border-black overflow-hidden"
        animate={{
          height: innerHeight === 'auto' ? 'auto' : innerHeight + 2,
        }}
        transition={LAYOUT_TRANSITION}
      >
        <div
          ref={innerRef}
          className="min-h-[174px] p-5 relative flex flex-col justify-center"
        >
          <AnimatePresence mode="wait">
            {step === 'item' && (
              <motion.div
                key="item"
                className="w-full flex flex-col gap-5 shrink-0"
                initial={{ opacity: 1, x: 0 }}
                animate={STEP_ENTER_ANIMATION}
                exit={STEP_EXIT_ANIMATION}
              >
                <form
                  className="w-full flex flex-col gap-5"
                  onSubmit={(event) =>
                    handleStepSubmit(event, canSubmitItem, () =>
                      setStep('email'),
                    )
                  }
                >
                  <div className="w-full flex flex-col gap-1">
                    <p>list new item</p>
                    <small className="block text-ellipsis overflow-hidden whitespace-nowrap">
                      enter the product name
                    </small>
                  </div>
                  <input
                    type="text"
                    placeholder="Citrus Flavoured Soft Drink"
                    value={itemName}
                    onChange={(event) =>
                      setItemName(event.target.value.replace(/[\r\n]+/g, ' '))
                    }
                    className="w-full bg-transparent"
                    autoFocus
                  />
                  <SubmitButton disabled={!canSubmitItem} label="continue" />
                </form>
              </motion.div>
            )}
            {step === 'email' && (
              <EmailStep
                email={email}
                canSubmitEmail={canSubmitEmail}
                onEmailChange={setEmail}
                onSubmit={() => setStep('code')}
              />
            )}
            {step === 'code' && (
              <CodeStep
                email={email}
                code={code}
                canSubmitCode={canSubmitCode}
                isVerifying={isVerifying}
                codeInputRef={codeInputRef}
                moveCodeCaretToEnd={moveCodeCaretToEnd}
                onCodeChange={setCode}
                onSubmit={() => setIsVerifying(true)}
                onLoadingComplete={() => {
                  setIsVerifying(false);
                  setIsSubmitted(true);
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
