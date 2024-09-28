import { cx } from 'class-variance-authority';
import { Button } from '../shadcn/Button';
import Link from 'next/link';

export const HexLink: IComponent<{
  href: string;
  content?: string;
  isFull?: boolean;
  className?: string;
}> = ({ content, isFull = false, href, className }) => {
  const formattedContent = content?.startsWith('41') ? content.replace('41', '0x') : content;
  return (
    <Button variant="link" className={cx('text-accent-foreground font-mono text-base', className)}>
      <Link href={href}>
        {!isFull
          ? `${formattedContent?.slice(0, 16)}...${formattedContent?.slice(-4)}`
          : formattedContent}
      </Link>
    </Button>
  );
};
