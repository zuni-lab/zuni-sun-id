import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { clsx } from 'clsx';
import { AccountInfoPanel } from './AccountInfoPanel';
import { Identicon } from './Idention';

const DropdownMenuContentStyle = {
  marginTop: '-22px',
};

export const AccountDropdown: IComponent = () => {
  const { address } = useWallet();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild className="w-4 h-4">
        <div className="flex h-4 w-4 items-center justify-center">
          {address && (
            <button className="p-1 rounded-full border-2 border-muted-foreground">
              <Identicon value={address} size={32} />
            </button>
          )}
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={40}
          className={clsx(
            'h-42 inline-flex w-60 flex-col items-start justify-start',
            'rounded-lg bg-neutral-900 bg-opacity-90 px-6 pb-2 pt-6 shadow backdrop-blur-2xl'
          )}
          style={DropdownMenuContentStyle}>
          <AccountInfoPanel />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
