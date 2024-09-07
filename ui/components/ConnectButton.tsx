'use client';

import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useWalletModal } from '@tronweb3/tronwallet-adapter-react-ui';

export const ConnectButton: IComponent = () => {
  const { address, connected, wallet, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  return (
    <div>
      {connected ? (
        <div>
          <div>
            <h2>Wallet Connection Info</h2>
            <p>
              <span>Your selected Wallet:</span> {wallet?.adapter.name}
            </p>
            <p>
              <span>Your Address:</span> {address}
            </p>
            <button onClick={disconnect}>Disconnect Wallet</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setVisible(true)}>Connect Wallet</button>
      )}
    </div>
  );
};
