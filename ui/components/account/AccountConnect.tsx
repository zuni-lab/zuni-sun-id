'use client';

import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useWalletModal } from '@tronweb3/tronwallet-adapter-react-ui';
import { Button } from '../shadcn/Button';
import { AccountDropdown } from './AccountDropdown';

// type TronWebWithExt = TronWeb & {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   event: any;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   contract: any;
// };

// const handleRegister = async () => {
//   if (connected && window.tronWeb) {
//     console.log('called');
//     const events = await (window.tronWeb as TronWebWithExt).event.getEventsByTransactionID(
//       '97039890e29f2b1dad110e283a59c39c712a1ca902ca687ae29c6b0f1580fbd2',
//       { only_confirmed: true }
//     );
//     console.log(events);

//     const contract = await (window.tronWeb as TronWebWithExt).contract(
//       abi,
//       'TG7ZW9xPDU4FoHdJJfQgs9zoX72ThukLZz'
//     );
//     const data = await contract
//       .getSchema('0x2b4fb0af6589cfbdc945e6a9b293f83be66b5d01b19bb9f37b75bb5564c8c164')
//       .call();
//     console.log(data);
//     const tx = await contract.register([], 'TLY4qnH7TaLRVrmXdwFKUzs2BR9pxuTPXZ', false).send();
//     console.log(tx);
//   }
// };

export const AccountConnect: IComponent = () => {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();

  return (
    <div>
      {connected && <AccountDropdown />}
      {!connected && (
        <Button
          className="bg-secondary hover:bg-muted hover:scale-105 transition-all duration-150"
          onClick={() => setVisible(true)}>
          Connect
        </Button>
      )}
    </div>
  );
};
