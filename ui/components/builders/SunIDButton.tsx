import Link from 'next/link';

import { buttonVariants } from '../shadcn/Button';

export const SunIDButton: IComponent<{
  href: string;
  name: string;
}> = ({ href, name }) => {
  return (
    <Link
      className={buttonVariants({
        variant: 'secondary',
        className: 'bg-black/80 hover:bg-black/60',
      })}
      href={href}>
      {name}
    </Link>
  );
};
