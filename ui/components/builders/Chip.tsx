import { cx } from '@/utils/tools';
import { Button } from '../shadcn/Button';

export const Chip: IComponent<{
  text: string | number;
  color?: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'gray' | 'orange';
  className?: string;
  buttonClassName?: string;
}> = ({ color = 'red', text, className, buttonClassName }) => {
  return (
    <div className={className}>
      <Button
        className={cx(
          `  py-1 px-3 w-fit h-fit rounded-lg`,
          {
            'bg-red-500 hover:bg-red-600': color === 'red',
            'bg-green-500 hover:bg-green-600': color === 'green',
            'bg-blue-500 hover:bg-blue-600': color === 'blue',
            'bg-yellow-500 hover:bg-yellow-600': color === 'yellow',
            'bg-purple-500 hover:bg-purple-600': color === 'purple',
            'bg-gray-500 hover:bg-gray-600': color === 'gray',
            'bg-orange-500 hover:bg-orange-600': color === 'orange',
          },
          buttonClassName
        )}>
        {text}
      </Button>
    </div>
  );
};
