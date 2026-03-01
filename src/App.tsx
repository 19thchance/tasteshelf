import { useLayoutEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';

import { Header } from './components/Header';
import { Landing } from './pages/Landing';
import { Product } from './pages/Product';
import { useDialog } from './hooks/useDialogStore';

function Wrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return <>{children}</>;
}

function App() {
  const { action } = useDialog();

  return (
    <AnimatePresence>
      {action !== null && (
        <motion.div
          key="dialog-overlay"
          className="fixed inset-0 backdrop-blur-lg bg-white/0 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
      <Wrapper>
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/item/:company/:product" element={<Product />} />
        </Routes>
      </Wrapper>
    </AnimatePresence>
  );
}

export default App;
