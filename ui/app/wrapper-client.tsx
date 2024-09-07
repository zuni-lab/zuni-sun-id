'use client';
import React, { Suspense, useEffect, useMemo } from 'react';
import { injectStyle } from 'react-toastify/dist/inject-style';
import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { TronLinkAdapter } from '@tronweb3/tronwallet-adapters';
import { WalletModalProvider } from '@tronweb3/tronwallet-adapter-react-ui';
import {
  WalletDisconnectedError,
  WalletError,
  WalletNotFoundError,
} from '@tronweb3/tronwallet-abstract-adapter';
import '@tronweb3/tronwallet-adapter-react-ui/style.css';

import { Footer } from '@/components/Footer';
import { Authentication } from './Authentication';

export const WrapperClientLayout: IComponent = ({ children }) => {
  function onError(e: WalletError) {
    if (e instanceof WalletNotFoundError) {
      // some alert for wallet not found
    } else if (e instanceof WalletDisconnectedError) {
      // some alert for wallet not connected
    } else {
      console.error(e.message);
    }
  }
  const adapters = useMemo(function () {
    const tronLink = new TronLinkAdapter();
    return [tronLink];
  }, []);

  useEffect(() => {
    injectStyle();
  }, []);

  return (
    <div className="w-full h-auto relative text-white">
      <WalletProvider onError={onError} adapters={adapters}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
      <Footer />
      <Suspense>
        <Authentication />
      </Suspense>
    </div>
  );
};
