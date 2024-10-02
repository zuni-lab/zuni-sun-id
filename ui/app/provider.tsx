'use client';

import TronProvider from '@/components/TronProvider';
import { ToastTemplate } from '@/constants/toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  WalletDisconnectedError,
  WalletError,
  WalletNotFoundError,
} from '@tronweb3/tronwallet-abstract-adapter';
import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { WalletModalProvider } from '@tronweb3/tronwallet-adapter-react-ui';
import { TronLinkAdapter } from '@tronweb3/tronwallet-adapters';
import React, { useMemo } from 'react';

const onError = (e: WalletError) => {
  if (e instanceof WalletNotFoundError) {
    ToastTemplate.Wallet.NotFound();
  } else if (e instanceof WalletDisconnectedError) {
    ToastTemplate.Wallet.Disconnected();
  } else {
    console.error(e);
    ToastTemplate.Wallet.Unknown();
  }
};

function Providers({ children }: React.PropsWithChildren) {
  const [client] = React.useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } })
  );

  const adapters = useMemo(function () {
    const tronLink = new TronLinkAdapter();
    return [tronLink];
  }, []);

  return (
    <QueryClientProvider client={client}>
      <WalletProvider onError={onError} adapters={adapters}>
        <WalletModalProvider>
          <TronProvider>{children}</TronProvider>
        </WalletModalProvider>
      </WalletProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default Providers;
