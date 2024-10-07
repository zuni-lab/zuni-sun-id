import { cx } from 'class-variance-authority';
import { Copy } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';

import { Button } from '../shadcn/Button';

export const HexLink: IComponent<{
  href: string;
  content?: string;
  isFull?: boolean;
  className?: string;
}> = ({ content, isFull = false, href, className }) => {
  const formattedContent = content?.startsWith('41') ? content.replace('41', '0x') : content;
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="link"
        className={cx('text-accent-foreground font-mono text-base px-0 justify-start', className)}>
        <Link href={href}>
          {!isFull
            ? `${formattedContent?.slice(0, 16)}...${formattedContent?.slice(-4)}`
            : formattedContent}
        </Link>
      </Button>
      {content && <CopyToClipboard content={content} />}
    </div>
  );
};

export const CopyToClipboard: IComponent<{
  content: string;
}> = ({ content }) => {
  const [copy, setCopy] = useState(false);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(content);
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 500);
  }, [content]);

  return (
    <Button
      variant="link"
      className="text-accent-foreground font-mono text-base px-0 justify-start"
      onClick={copyToClipboard}>
      <span className="relative">
        <Copy size={18} />
        {copy && (
          <span className="absolute -top-6 left-full -translate-x-1/3 text-sm bg-black/80 text-white px-2 rounded-md">
            Copied!
          </span>
        )}
      </span>
    </Button>
  );
};
