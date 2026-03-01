import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, Transition, useAnimate } from 'motion/react';

import { Action, useDialog } from '../hooks/useDialogStore';

export function Header() {
  const { action, setAction } = useDialog();

  const [searchValue, setSearchValue] = useState<string>('');
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [scope, animate] = useAnimate();
  const navigate = useNavigate();

  const textTransition = {
    duration: 1,
    ease: 'easeOut',
  } satisfies Transition;

  useEffect(() => {
    const handleClick = (e: Event) => {
      if (!searchContainerRef.current) return;

      if (searchContainerRef.current.contains(e.target as Node)) {
        setAction(Action.Searching);
      } else if (useDialog.getState().action === Action.Searching) {
        setAction(null);
      }
    };

    document.addEventListener('click', handleClick, false);

    return () => {
      document.removeEventListener('click', handleClick, false);
    };
  }, []);

  useEffect(() => {
    if (action === Action.Searching) return;

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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action === Action.Searching, animate]);

  useEffect(() => {
    if (action === Action.Searching) {
      if (!searchInputRef.current) return;

      setSearchValue('');
      searchInputRef.current.focus();
    }
  }, [action]);

  return (
    <>
      <div className="flex justify-center">
        <div className="w-[1840px] max-w-[calc(100%_-_80px)] h-20 fixed flex items-center justify-between z-20">
          <div
            className="relative flex flex-col gap-5 cursor-text"
            ref={searchContainerRef}
          >
            <div className="w-[360px] h-[18px] flex gap-1.5 overflow-hidden shrink-0">
              <p>search</p>
              <AnimatePresence>
                <div className="h-full w-full relative overflow-hidden">
                  {action !== Action.Searching && (
                    <div className="min-w-0 h-full flex flex-col" ref={scope}>
                      {
                        // temp
                        [
                          'Mountain Dew Citrus Flavored Soft Drink',
                          'Red Bull Yellow Edition Energy Drink (Tropical Flavor)',
                        ].map((text, i) => (
                          <motion.p
                            key={i}
                            className="w-full h-full text-ellipsis overflow-hidden whitespace-nowrap shrink-0"
                          >
                            {text}
                          </motion.p>
                        ))
                      }
                    </div>
                  )}
                  <input
                    className={`w-full h-full absolute flex-1 bg-transparent ${
                      action === Action.Searching
                        ? 'opacity-100'
                        : 'opacity-0 pointer-events-none'
                    }`}
                    ref={searchInputRef}
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {action === Action.Searching && (
                <motion.div
                  className="top-full mt-5 absolute flex flex-col gap-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-[360px] px-2.5 py-5 flex gap-2.5 bg-white border border-black no-scrollbar overflow-x-auto">
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
          <p
            className="absolute left-1/2 -translate-x-1/2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            tasteshelf.com
          </p>
          <p className="cursor-pointer hover:underline">list new item</p>
        </div>
      </div>
    </>
  );
}
