'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, Transition, useAnimate } from 'motion/react';
import { useRouter } from 'next/navigation';

import { useDialog } from '../hooks/useDialogStore';
import { Action } from '../types/dialogType';

const textTransition = {
  duration: 1,
  ease: 'easeInOut',
} satisfies Transition;

function SearchControl() {
  const isSearching = useDialog((state) => state.action === Action.Searching);
  const setAction = useDialog((state) => state.setAction);

  const [searchValue, setSearchValue] = useState<string>('');

  const searchInputRef = useRef<HTMLInputElement>(null);

  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (isSearching) return;

    let stopped = false;
    let controls: any[] = [];

    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    const loopMarquee = async () => {
      while (!stopped) {
        await sleep(2000);
        if (stopped || !scope.current) break;

        controls = [
          animate('p:first-child', { y: [0, 18] }, textTransition),
          animate('p:last-child', { y: [-36, -18] }, textTransition),
        ];
        await Promise.all(controls);

        await sleep(2000);
        if (stopped || !scope.current) break;

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
      controls.forEach((c) => c.stop());

      if (!scope.current) return;

      const lines = scope.current.querySelectorAll(
        'p',
      ) as NodeListOf<HTMLParagraphElement>;

      lines.forEach((element) => {
        element.style.transform = '';
      });
    };
  }, [animate, isSearching, scope]);

  useEffect(() => {
    if (!isSearching || !searchInputRef.current) return;

    setSearchValue('');
    searchInputRef.current.focus();
  }, [isSearching]);

  return (
    <div
      className="relative flex flex-col gap-5 cursor-text pointer-events-auto"
      onClick={() => setAction(Action.Searching)}
    >
      <div className="w-[360px] h-[18px] flex gap-1.5 overflow-hidden shrink-0">
        <p>search</p>
        <div className="w-full h-full relative overflow-hidden">
          {!isSearching && (
            <div className="min-w-0 h-full flex flex-col" ref={scope}>
              {[
                'Mountain Dew Citrus Flavored Soft Drink',
                'Red Bull Yellow Edition Energy Drink (Tropical Flavor)',
              ].map((text, i) => (
                <motion.p
                  key={i}
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
            onChange={(e) => setSearchValue(e.target.value)}
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
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <div className="w-[360px] p-5 flex gap-5 bg-white border border-black no-scrollbar overflow-x-auto">
              {Array.from({ length: 8 }).map((_, index) => {
                return (
                  <img
                    key={index}
                    src="https://image.goat.com/transform/v1/attachments/product_template_pictures/images/115/095/782/original/KJ2932.png.png?width=200"
                    className="w-[60px] shrink-0 aspect-square cursor-pointer"
                    alt="Beverage Product"
                  />
                );
              })}
            </div>
            <div className="w-[360px] p-5 bg-white border border-black group">
              <div className="flex flex-wrap gap-x-5">
                {[
                  ...(searchValue ? [`all ${searchValue}`] : []),
                  'PRIME Hydration Blue Raspberry',
                  'Red Bull Yellow Edition Energy Drink (Tropical Flavor)',
                  'Mountain Dew Citrus Flavoured Soft Drink',
                  'Starbucks Frappuccino Caramel',
                  'Red Bull Energy Drink',
                  'Crush Orange',
                  'Dr Pepper Cherry',
                  'Canada Dry Ginger Ale',
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

function ListingControl() {
  const isListing = useDialog((state) => state.action === Action.Listing);
  const setAction = useDialog((state) => state.setAction);

  return (
    <div
      className="relative flex flex-col items-end pointer-events-auto"
      onClick={() => setAction(Action.Listing)}
    >
      <p className="cursor-pointer hover:underline">list new item</p>
      <AnimatePresence>
        {isListing && (
          <motion.div
            className="top-full mt-5 absolute flex flex-col gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <div className="w-[360px] p-5 flex gap-5 bg-white border border-black no-scrollbar overflow-x-auto">
              {Array.from({ length: 8 }).map((_, index) => {
                return (
                  <img
                    key={index}
                    src="https://image.goat.com/transform/v1/attachments/product_template_pictures/images/115/095/782/original/KJ2932.png.png?width=200"
                    className="w-[60px] shrink-0 aspect-square cursor-pointer"
                    alt="Beverage Product"
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const router = useRouter();

  return (
    <div className="flex justify-center pointer-events-none">
      <div className="w-[1840px] max-w-[calc(100%_-_80px)] h-20 fixed flex items-center justify-between z-20">
        <SearchControl />
        <p
          className="absolute left-1/2 -translate-x-1/2 cursor-pointer pointer-events-auto"
          onClick={() => router.push('/')}
        >
          tasteshelf.com
        </p>
        <ListingControl />
      </div>
    </div>
  );
}
