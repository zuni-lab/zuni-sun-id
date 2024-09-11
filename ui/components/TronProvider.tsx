'use client';

//@ts-expect-error - no types for tronweb
import TronWeb from 'tronweb';

import { TronWebWithExt } from '@/types/tronWeb';
import { createContext, memo, useContext } from 'react';

const MOCK_PRIVATE_KEY = '0000000000000000000000000000000000000000000000000000000000000001';

export let globalTronWeb: TronWebWithExt | null = null;

const TronWebContext = createContext<TronWebWithExt | null>(null);

const TronWebProvider: IComponent = ({ children }) => {
  if (globalTronWeb === null) {
    globalTronWeb = new TronWeb({
      fullHost: 'https://api.shasta.trongrid.io',
      privateKey: MOCK_PRIVATE_KEY,
    });

    if (typeof window !== 'undefined' && !window.tronWeb) {
      window.tronWeb = globalTronWeb ? globalTronWeb : undefined;
    }
  }

  return <TronWebContext.Provider value={globalTronWeb}>{children}</TronWebContext.Provider>;
};

export const useTronWeb = (): TronWebWithExt => {
  const tronWeb = useContext(TronWebContext);

  if (tronWeb === null) {
    throw new Error('TronWebProvider should be placed at the top of the component');
  }

  return tronWeb;
};

export default memo(TronWebProvider);
