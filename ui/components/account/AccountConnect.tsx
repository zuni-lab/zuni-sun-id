'use client';

import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useWalletModal } from '@tronweb3/tronwallet-adapter-react-ui';
import { Button } from '../shadcn/Button';
import { AccountDropdown } from './AccountDropdown';

export const AccountConnect: IComponent = () => {
  const tronWeb = useWallet();
  const { setVisible } = useWalletModal();

  const { connected } = tronWeb;

  return (
    <div>
      {connected && <AccountDropdown />}
      {!connected && (
        <Button
          type="button"
          size={'lg'}
          className="bg-accent-foreground hover:scale-105 transition-all duration-150 px-4"
          onClick={() => setVisible(true)}>
          Connect
        </Button>
      )}
    </div>
  );
};
