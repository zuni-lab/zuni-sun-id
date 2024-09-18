'use client';
import { Suspense, useEffect } from 'react';
import { injectStyle } from 'react-toastify/dist/inject-style';

import '@tronweb3/tronwallet-adapter-react-ui/style.css';

import { Footer } from '@/components/Footer';
import { Authentication } from './Authentication';
import { Navigation } from '@/components/Navigation';

export const WrapperClientLayout: IComponent = ({ children }) => {
  useEffect(() => {
    injectStyle();
  }, []);

  return (
    <div className="w-full h-auto relative">
      <Navigation />
      {children}
      <Footer />
      <Suspense>
        <Authentication />
      </Suspense>
    </div>
  );
};
