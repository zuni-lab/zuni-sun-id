import { Button } from '../shadcn/Button';

export const HexLink: IComponent<{ content?: string; isFull?: boolean }> = ({
  content,
  isFull = false,
}) => {
  const formattedContent = content?.replace('41', '0x');
  return (
    <Button variant="link" className="text-gray-200 font-mono">
      {!isFull && formattedContent?.slice(0, 20)}...{formattedContent?.slice(-4)}
      {isFull && formattedContent}
    </Button>
  );
};
