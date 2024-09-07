import { formatWalletAddress } from '@/utils/tools';

export const Address: IComponent<{
  address: string;
}> = ({ address }) => {
  return <span>{formatWalletAddress(address)}</span>;
};
