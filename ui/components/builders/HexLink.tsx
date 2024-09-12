import { Button } from '../shadcn/Button';

export const HexLink: IComponent<{ content?: string }> = ({ content }) => {
  return (
    <Button variant="link" className="text-gray-200">
      {content?.slice(0, 20)}...{content?.slice(-4)}
    </Button>
  );
};
