'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { Dialog } from './Dialog';
import { Header } from './header/Header';
import { useDialog } from '../hooks/useDialogStore';
import { useRegion } from '../hooks/useRegionStore';
import { getCountryCode } from '../services/regionService';
import { Action } from '../types/dialogType';

function DialogLayer() {
  const isDialogOpen = useDialog((state) => state.action !== null);
  const isReviewing = useDialog((state) => state.action === Action.Reviewing);
  const setAction = useDialog((state) => state.setAction);

  return (
    <AnimatePresence>
      {isDialogOpen && (
        <motion.div
          key="dialog-overlay"
          className="fixed inset-0 backdrop-blur-sm bg-white/0 z-10"
          onClick={() => setAction(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
      {isReviewing && <Dialog key="dialog" />}
    </AnimatePresence>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const setCountryCode = useRegion((state) => state.setCountryCode);

  useEffect(() => {
    getCountryCode().then((countryCode) => {
      setCountryCode(countryCode);
    });
  }, [setCountryCode]);

  return (
    <>
      <DialogLayer />
      <Header />
      {children}
    </>
  );
}
