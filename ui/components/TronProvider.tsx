'use client';

//@ts-expect-error - no types for tronweb
import TronWeb from 'tronweb';

import { tronNetworks, TSupportedNetworks } from '@/constants/configs';
import { MOCK_PRIVATE_KEY } from '@/constants/mock';
import { NetworkType } from '@tronweb3/tronwallet-abstract-adapter';
import { createContext, memo, useCallback, useContext, useEffect, useState } from 'react';

type TronWebContextProps = {
  tronWeb: TronWeb | null;
  network: TSupportedNetworks;
  address: string;
  balance: string;
  connected: boolean;
  setNetwork: (network: TSupportedNetworks) => void;
  connectWallet: (network: TSupportedNetworks) => void;
  disconnectWallet: () => void;
  signTronData: (contract: string, types: object, values: object) => Promise<string>;
};

const TronWebContext = createContext<TronWebContextProps | null>(null);

export const defaultTronWeb = new TronWeb({
  fullHost: tronNetworks.Shasta.fullNode,
  privateKey: MOCK_PRIVATE_KEY,
});

export const useTron: () => TronWebContextProps = () => {
  const ctx = useContext(TronWebContext);
  if (ctx === null) {
    throw new Error('TronWebProvider should be placed at the top of the component');
  }

  return ctx;
};

export const useTronWeb = () => {
  const { tronWeb } = useTron();
  return tronWeb ? tronWeb : defaultTronWeb;
};

const TronWebProvider: IComponent = ({ children }) => {
  const [tronWeb, setTronWeb] = useState<TronWeb | null>(null);
  const [network, setNetwork] = useState<TSupportedNetworks>(NetworkType.Shasta);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');

  const connectWallet = useCallback(
    async (selectedNetwork: TSupportedNetworks) => {
      try {
        const networkConfig = tronNetworks[selectedNetwork];

        // Initialize TronWeb with the selected network
        const tronInstance = new TronWeb(
          networkConfig.fullNode,
          networkConfig.solidityNode,
          networkConfig.eventServer
        );

        // Check if TronLink is installed and connected
        if (window.tronWeb && window?.tronWeb?.defaultAddress?.base58) {
          setTronWeb(window.tronWeb); // Use TronLink if available
          setAddress(window.tronWeb.defaultAddress.base58);
        } else {
          setTronWeb(tronInstance);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        throw new Error('Failed to connect wallet:', error.message);
      }
    },
    [setTronWeb, setAddress]
  );

  const fetchBalance = useCallback(async () => {
    if (!tronWeb || !address) {
      return;
    }

    const balance = await tronWeb.trx.getBalance(address);
    setBalance(balance);
  }, [tronWeb, address]);

  const disconnectWallet = useCallback(async () => {
    try {
      if (window.tronWeb) {
        setTronWeb(null);
        setAddress('');
        setBalance('');
      }
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  }, [setTronWeb, setAddress, setBalance]);

  const signTronData = useCallback(
    async (contract: string, types: object, values: object) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (tronWeb as any).trx._signTypedData(
        {
          name: 'SunID',
          version: '1',
          chainId: tronNetworks[network].chainId,
          verifyingContract: contract,
        },
        types,
        values
      );
    },
    [tronWeb, network]
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).tronWeb) {
      setTronWeb(window.tronWeb);
    } else {
      console.warn('TronLink not installed. Using default TronWeb');
      setTronWeb(defaultTronWeb);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  useEffect(() => {
    connectWallet(network);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TronWebContext.Provider
      value={{
        tronWeb,
        network,
        address,
        balance,
        connected: !!address,
        setNetwork,
        connectWallet,
        disconnectWallet,
        signTronData,
      }}>
      {children}
    </TronWebContext.Provider>
  );
};

export default memo(TronWebProvider);
