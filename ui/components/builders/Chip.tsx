import Link from 'next/link';

import { cx } from '@/utils/tools';

import { buttonVariants } from '../shadcn/Button';

export const Chip: IComponent<{
  text: string | number;
  color?: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'gray' | 'orange';
  className?: string;
  buttonClassName?: string;
  href?: string;
}> = ({ color = 'red', text, className, buttonClassName, href }) => {
  return (
    <div className={className}>
      <Link
        href={href || '#'}
        className={cx(
          buttonVariants(),
          `  py-1 px-2 w-fit h-fit rounded-lg`,
          {
            'bg-red-500 hover:bg-red-500': color === 'red',
            'bg-green-500 hover:bg-green-500': color === 'green',
            'bg-blue-500 hover:bg-blue-500': color === 'blue',
            'bg-yellow-500 hover:bg-yellow-500': color === 'yellow',
            'bg-purple-500 hover:bg-purple-500': color === 'purple',
            'bg-gray-500 hover:bg-gray-500': color === 'gray',
            'bg-orange-500 hover:bg-orange-500': color === 'orange',
          },
          buttonClassName
        )}>
        {text}
      </Link>
    </div>
  );
};
