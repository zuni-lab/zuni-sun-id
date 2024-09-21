'use client';
import { Suspense, useEffect } from 'react';
import { injectStyle } from 'react-toastify/dist/inject-style';

import '@tronweb3/tronwallet-adapter-react-ui/style.css';

import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { ProjectENV } from '@env';
import { Authentication } from './Authentication';

export const WrapperClientLayout: IComponent = ({ children }) => {
  useEffect(() => {
    injectStyle();
  }, []);

  return (
    <div className="w-full h-auto relative">
      {ProjectENV.NEXT_PUBLIC_NOTIFICATION && (
        <div className="bg-black text-lg font-bold text-white text-center p-3.5">
          {ProjectENV.NEXT_PUBLIC_NOTIFICATION}
        </div>
      )}
      <Navigation />
      {children}
      <Footer />
      <Suspense>
        <Authentication />
      </Suspense>
    </div>
  );
};
