'use client';
import { Suspense, useEffect } from 'react';
import { injectStyle } from 'react-toastify/dist/inject-style';

import { Footer } from '@/components/Footer';
import { Authentication } from './Authentication';

import TronWeb from '@zuni-lab/tronweb-ts';

const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  headers: { 'TRON-PRO-API-KEY': 'your api key' },
  privateKey: 'your private key',
} as any);

console.log({ tronWeb });

export const WrapperClientLayout: IComponent = ({ children }) => {
  useEffect(() => {
    injectStyle();
  }, []);

  return (
    <div className="w-full h-auto relative text-white">
      {children}
      <Footer />
      <Suspense>
        <Authentication />
      </Suspense>
    </div>
  );
};
