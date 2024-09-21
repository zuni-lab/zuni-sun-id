import { cx } from 'class-variance-authority';
import { Button } from '../shadcn/Button';

export const HexLink: IComponent<{
  content?: string;
  isFull?: boolean;
  href?: string;
  className?: string;
}> = ({ content, isFull = false, href, className }) => {
  const formattedContent = content?.startsWith('41') ? content.replace('41', '0x') : content;
  return (
    <Button
      variant="link"
      className={cx('text-accent-foreground font-mono text-base', className)}
      onClick={href ? () => window.open(href, '_blank') : undefined}>
      {!isFull && `${formattedContent?.slice(0, 16)}...${formattedContent?.slice(-4)}`}
      {isFull && formattedContent}
    </Button>
  );
};
