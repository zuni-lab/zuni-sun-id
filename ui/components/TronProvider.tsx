'use client';

import { NetworkType } from '@tronweb3/tronwallet-abstract-adapter';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useWalletModal } from '@tronweb3/tronwallet-adapter-react-ui';
import { getNetworkInfoByTronWeb } from '@tronweb3/tronwallet-adapters';
import { createContext, memo, useCallback, useContext, useEffect, useState } from 'react';
//@ts-expect-error - no types for tronweb
import TronWeb from 'tronweb';

import { tronNetworks, TSupportedNetworks } from '@/constants/configs';
import { MOCK_PRIVATE_KEY } from '@/constants/mock';

type TronWebContextProps = {
  tronWeb: TronWeb | null;
  network: TSupportedNetworks;
  address: string;
  balance: string;
  connected: boolean;
  setNetwork: (network: TSupportedNetworks) => void;
  connectWallet: () => void;
  disconnectWallet: () => void;
  signTronData: (contract: string, types: object, values: object) => Promise<string>;
};

const TronWebContext = createContext<TronWebContextProps | null>(null);

export const defaultTronWeb = new TronWeb({
  fullHost: tronNetworks.Shasta.fullNode,
  eventServer: tronNetworks.Shasta.eventServer,
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
  const { connected } = useWallet();
  return connected ? tronWeb : defaultTronWeb;
};

const TronWebProvider: IComponent = ({ children }) => {
  const { setVisible } = useWalletModal();
  const { disconnect, address: connectedAddr } = useWallet();
  const [tronWeb, setTronWeb] = useState<TronWeb | null>(null);
  const [network, setNetwork] = useState<TSupportedNetworks>(NetworkType.Shasta);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');

  const connectWallet = async () => {
    setVisible(true);
  };

  const fetchBalance = useCallback(async () => {
    if (!tronWeb || !address) {
      return;
    }

    const balance = await tronWeb.trx.getBalance(address);
    setBalance(balance);
  }, [tronWeb, address]);

  const disconnectWallet = useCallback(async () => {
    try {
      await disconnect();
      if (window.tronWeb) {
        setTronWeb(null);
        setAddress('');
        setBalance('');
      }
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  }, [setTronWeb, setAddress, setBalance, disconnect]);

  const signTronData = useCallback(
    async (contract: string, types: object, values: object) => {
      //
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
    //
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
    (async () => {
      // Check if TronLink is installed and connected
      if (connectedAddr && window.tronWeb) {
        console.log('Wallet connected:', connectedAddr);
        const { networkType } = await getNetworkInfoByTronWeb(window.tronWeb);
        if (networkType != NetworkType.Shasta) {
          throw new Error('Please connect to Shasta testnet');
        }

        setNetwork(networkType as TSupportedNetworks);
        setTronWeb(window.tronWeb);
        setAddress(connectedAddr);
      }
    })();
  }, [connectedAddr]);

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
