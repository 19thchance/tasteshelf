'use client';

import { AnimatePresence, motion } from 'motion/react';

import { useDialog } from '../../hooks/useDialogStore';
import { Action } from '../../types/dialogType';
import { ProductTicker } from '../ProductTicker';
import { HEADER_PREVIEW_PRODUCTS } from './constants';

export function ListingControl() {
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
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <ProductTicker products={HEADER_PREVIEW_PRODUCTS} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
