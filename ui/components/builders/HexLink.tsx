import { Button } from '../shadcn/Button';

export const HexLink: IComponent<{ content: string }> = ({ content }) => {
  return (
    <Button variant="link" className="text-gray-200">
      {content}
    </Button>
  );
};
