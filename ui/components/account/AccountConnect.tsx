'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ExitIcon } from '@radix-ui/react-icons';
import { clsx } from 'clsx';
import { Copy } from 'lucide-react';

import { formatBalance } from '@/utils/tools';

import { TronLogo } from '../icons/TronLogo';
import { Button } from '../shadcn/Button';
import { useTron } from '../TronProvider';
import { Address } from './Address';
import { Identicon } from './Idention';

export const AccountConnect: IComponent = () => {
  const { connected, address, network, balance, disconnectWallet } = useTron();

  // const handleNetworkChange = useCallback(
  //   (network: TSupportedNetworks) => {
  //     setNetwork(network);
  //     connectWallet(network);
  //   },
  //   [setNetwork, connectWallet]
  // );

  return (
    <div className="w-fit h-full">
      {connected && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild className="cursor-pointer w-[340px]">
            <div className="flex items-center space-x-2 px-2 py-1 whitespace-nowrap border rounded-lg border-black">
              <div className="flex items-center gap-1 border-r border-gray-700 px-2">
                <TronLogo className="w-4 h-4" />
                <span className="font-bold flex items-center">{`${network.toString()}`}</span>
              </div>
              <button className="p-1 rounded-full border-2 border-muted-foreground">
                <Identicon value={address} size={20} className="w-8 h-8" />
              </button>
              <Address address={address} />
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={32}
              className={clsx(
                'h-auto inline-flex w-[340px] flex-col items-start justify-start',
                'rounded-lg bg-opacity-90 px-6 pb-2 pt-6 shadow backdrop-blur-2xl'
              )}
              style={{ marginTop: '-22px' }}>
              <div className="mb-4 flex gap-3 font-semibold items-center">
                {address.slice(0, 20) + '...' + address.slice(-4)}
                <Copy
                  className="cursor-pointer hover:text-gray-500 w-5 h-5"
                  onClick={() => navigator.clipboard.writeText(address)}
                />
              </div>

              {/* <div className="mb-2 font-bold">Select Network:</div>
              {SupportedNetworks.map((nw) => (
                <DropdownMenu.Item
                  key={nw}
                  onClick={() => handleNetworkChange(nw)}
                  className={cx('w-full cursor-pointer mb-1  p-2 rounded-lg', {
                    'bg-gray-100': nw === network,
                    'hover:bg-gray-200': nw !== network,
                  })}>
                  {`${nw.toString()} ${nw !== NetworkType.Mainnet ? '(Testnet)' : ''} `}
                  <span
                    className={`ml-2 text-xs font-bold text-gray-500 ${
                      nw === network ? 'text-green-600' : ''
                    }`}>
                    {nw === network ? '✔' : ''}
                  </span>
                </DropdownMenu.Item>
              ))} */}

              <hr className="h-px my-4 self-stretch border-transparent bg-zinc-400 bg-opacity-20" />
              <div className="inline-flex items-center justify-start gap-2">
                <span className="font-inter text-sm font-medium text-zinc-500">Balance:</span>
                <span className="font-inter text-base font-bold text-zinc-900">
                  {formatBalance(parseInt(balance))} TRX
                </span>
              </div>

              <hr className="h-px my-4 self-stretch border-transparent bg-zinc-400 bg-opacity-20" />

              <button
                type="button"
                aria-label="Disconnect"
                className="pb-4 inline-flex items-center justify-between self-stretch"
                onClick={async () => disconnectWallet()}>
                <span className="font-inter w-32 text-left text-base font-medium hover:bg-opacity-80 hover:opacity-80">
                  Log out
                </span>
                <ExitIcon className="relative h-4 w-4" />
              </button>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
      {!connected && <ConnectButton />}
    </div>
  );
};

export const ConnectButton: IComponent = () => {
  const { connectWallet } = useTron();
  return (
    <Button
      type="button"
      className="bg-accent-foreground transition-all duration-150 px-6 !py-0 hover:bg-gray-800/80"
      onClick={() => connectWallet()}>
      Connect Wallet
    </Button>
  );
};
