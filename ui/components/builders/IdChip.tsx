import { Button } from '../shadcn/Button';

export const IdChip: IComponent<{
  id: number;
}> = ({ id }) => {
  return (
    <Button className="bg-main/80 text-white py-1 px-2 w-fit h-fit hover:bg-main rounded-lg">
      #{id}
    </Button>
  );
};
