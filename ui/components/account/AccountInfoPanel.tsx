import { ExitIcon } from '@radix-ui/react-icons';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { Address } from './Address';

export function AccountInfoPanel() {
  const { address, disconnect, wallet } = useWallet();

  if (!address) return null;

  return (
    <>
      <div className="inline-flex items-center justify-start gap-2">
        <div className="inline-flex flex-col items-start justify-center gap-1">
          <Address address={address} />
          <span className="font-inter w-32 text-sm font-medium text-zinc-400">
            <span className="truncate">{wallet?.state}</span>
          </span>
        </div>
      </div>
      <hr className="h-px my-4 self-stretch border-transparent bg-zinc-400 bg-opacity-20" />
      <button
        type="button"
        aria-label="Disconnect"
        className="pb-4 inline-flex items-center justify-between self-stretch"
        onClick={async () => await disconnect()}>
        <span className="font-inter w-32 text-left text-base font-medium hover:bg-opacity-80 hover:opacity-80">
          Log out
        </span>
        <ExitIcon className="relative h-4 w-4" />
      </button>
    </>
  );
}
