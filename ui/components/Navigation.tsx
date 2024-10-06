import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/shadcn/Navigation';
import { AppRouter } from '@/constants/router';

import { AccountConnect } from './account/AccountConnect';
import { LogoSvg } from './icons/LogoSvg';
import { Search } from './Search';
import { useTron } from './TronProvider';

const spaceBetweenCamelCase = (str: string) =>
  str.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');

export const Navigation: IComponent = () => {
  const { address } = useTron();

  return (
    <div className="flex items-center py-6 px-6 gap-4 border-b border-accent">
      <Link href="/">
        <LogoSvg />
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          {Object.entries(AppRouter)
            .filter(
              ([k]) =>
                k !== 'Home' &&
                k !== 'Address' &&
                (address ? true : k !== 'MyCredentials')
            )
            .map(([k, v]) => (
              <NavigationMenuItem key={v}>
                <Link
                  href={k === 'MyCredentials' ? v.concat(`/${address}`) : v}
                  passHref
                  legacyBehavior>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {spaceBetweenCamelCase(k)}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="grow">
        <Search placeholder="Search by credential, schema, address, etc." />
      </div>
      <div className="flex justify-end items-center gap-2">
        <AccountConnect />
      </div>
    </div>
  );
};
