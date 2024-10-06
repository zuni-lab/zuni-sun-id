'use client';
import '@tronweb3/tronwallet-adapter-react-ui/style.css';

import { ProjectENV } from '@env';
import { Suspense, useEffect } from 'react';
import { injectStyle } from 'react-toastify/dist/inject-style';

import { Footer } from '@/components/Footer';
import { Heading } from '@/components/Heading';
import { Navigation } from '@/components/Navigation';
import { useCurrentHeading } from '@/constants/meta';

import { Authentication } from './Authentication';

export const WrapperClientLayout: IComponent = ({ children }) => {
  useEffect(() => {
    injectStyle();
  }, []);

  const heading = useCurrentHeading();

  const notification = ProjectENV.NEXT_PUBLIC_NOTIFICATION?.replace(/_/g, ' ').replace(/'/g, "")

  return (
    <div className="w-full h-auto relative">
      {ProjectENV.NEXT_PUBLIC_NOTIFICATION && (
        <div className="bg-black text-sm font-bold text-white text-center p-2">{notification}</div>
      )}
      <Navigation />
      {heading && <Heading {...heading} />}
      {children}
      <Footer />
      <Suspense>
        <Authentication />
      </Suspense>
    </div>
  );
};
