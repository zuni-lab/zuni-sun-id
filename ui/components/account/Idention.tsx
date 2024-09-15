import { formatWalletAddress } from '@/utils/tools';
import { toSvg } from 'jdenticon';
import { Avatar, AvatarFallback, AvatarImage } from '../shadcn/Avatar';

interface IdenticonProps {
  value: string;
  size: number;
  className?: string;
}

export const Identicon: IComponent<IdenticonProps> = ({ value, size, className }) => {
  const svg = toSvg(value, size);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  return (
    <Avatar className={className}>
      <AvatarImage src={url} sizes={`${size}px`} />
      <AvatarFallback>{formatWalletAddress(value)}</AvatarFallback>
    </Avatar>
  );
};
