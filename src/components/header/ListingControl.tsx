'use client';

import { AnimatePresence } from 'motion/react';

import { useDialog } from '../../hooks/useDialogStore';
import { Action } from '../../types/dialogType';
import { ListingPanel } from './ListingPanel';

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
        {isListing && <ListingPanel />}
      </AnimatePresence>
    </div>
  );
}
