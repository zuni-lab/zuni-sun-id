import { cx } from 'class-variance-authority';
import { Button } from '../shadcn/Button';

export const HexLink: IComponent<{
  content?: string;
  isFull?: boolean;
  href?: string;
  className?: string;
}> = ({ content, isFull = false, href, className }) => {
  const formattedContent = content?.replace('41', '0x');
  return (
    <Button
      variant="link"
      className={cx('text-gray-200 font-mono', className)}
      onClick={href ? () => window.open(href, '_blank') : undefined}>
      {!isFull && `${formattedContent?.slice(0, 20)}...${formattedContent?.slice(-4)}`}
      {isFull && formattedContent}
    </Button>
  );
};
