'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  type Transition,
  useAnimate,
} from 'motion/react';

import { useDialog } from '../../hooks/useDialogStore';
import { Action } from '../../types/dialogType';
import { ProductTicker } from '../ProductTicker';
import { HEADER_PREVIEW_PRODUCTS } from './constants';

const SEARCH_TEXT_HOLD_MS = 2000;
const SEARCH_MARQUEE_TEXTS = [
  'Mountain Dew Citrus Flavored Soft Drink',
  'Red Bull Yellow Edition Energy Drink (Tropical Flavor)',
];
const SEARCH_SUGGESTIONS = [
  'PRIME Hydration Blue Raspberry',
  'Red Bull Yellow Edition Energy Drink (Tropical Flavor)',
  'Mountain Dew Citrus Flavoured Soft Drink',
  'Starbucks Frappuccino Caramel',
  'Red Bull Energy Drink',
  'Crush Orange',
  'Dr Pepper Cherry',
  'Canada Dry Ginger Ale',
];

const textTransition = {
  duration: 1,
  ease: 'easeOut',
} satisfies Transition;

export function SearchControl() {
  const isSearching = useDialog((state) => state.action === Action.Searching);
  const setAction = useDialog((state) => state.setAction);

  const [searchValue, setSearchValue] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (isSearching) {
      return;
    }

    let stopped = false;
    let controls: Array<ReturnType<typeof animate>> = [];

    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    const loopMarquee = async () => {
      while (!stopped) {
        await sleep(SEARCH_TEXT_HOLD_MS);

        if (stopped || !scope.current) {
          break;
        }

        controls = [
          animate('p:first-child', { y: [0, 18] }, textTransition),
          animate('p:last-child', { y: [-36, -18] }, textTransition),
        ];

        await Promise.all(controls);
        await sleep(SEARCH_TEXT_HOLD_MS);

        if (stopped || !scope.current) {
          break;
        }

        controls = [
          animate('p:first-child', { y: [-18, 0] }, textTransition),
          animate('p:last-child', { y: [-18, 0] }, textTransition),
        ];

        await Promise.all(controls);
      }
    };

    loopMarquee();

    return () => {
      stopped = true;
      controls.forEach((control) => control.stop());

      if (!scope.current) {
        return;
      }

      const lines = scope.current.querySelectorAll(
        'p',
      ) as NodeListOf<HTMLParagraphElement>;

      lines.forEach((element) => {
        element.style.transform = '';
      });
    };
  }, [animate, isSearching, scope]);

  useEffect(() => {
    if (!isSearching || !searchInputRef.current) {
      return;
    }

    setSearchValue('');
    searchInputRef.current.focus();
  }, [isSearching]);

  return (
    <div
      className="relative flex flex-col gap-5 pointer-events-auto"
      onClick={() => setAction(Action.Searching)}
    >
      <div className="w-[360px] h-[18px] flex gap-1.5 overflow-hidden cursor-text shrink-0">
        <p>search</p>
        <div className="w-full h-full relative overflow-hidden">
          {!isSearching && (
            <div className="min-w-0 h-full flex flex-col" ref={scope}>
              {SEARCH_MARQUEE_TEXTS.map((text, index) => (
                <motion.p
                  key={index}
                  className="w-full h-full text-ellipsis overflow-hidden whitespace-nowrap shrink-0"
                >
                  {text.toLowerCase()}
                </motion.p>
              ))}
            </div>
          )}
          <input
            className={`w-full h-full absolute flex-1 bg-transparent ${
              isSearching ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            ref={searchInputRef}
            type="text"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </div>
      </div>
      <AnimatePresence>
        {isSearching && (
          <motion.div
            className="top-full mt-5 absolute flex flex-col gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <ProductTicker products={HEADER_PREVIEW_PRODUCTS} />
            <div className="w-[360px] p-5 bg-white border border-black group">
              <div className="flex flex-wrap gap-x-5">
                {[
                  ...(searchValue ? [`all ${searchValue}`] : []),
                  ...SEARCH_SUGGESTIONS,
                ].map((text, index) => (
                  <p
                    key={index}
                    className={`py-[11px] text-[14px] leading-[18px] flex items-center lowercase cursor-pointer hover:underline ${
                      searchValue && index === 0 ? 'break-all' : ''
                    }`}
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
