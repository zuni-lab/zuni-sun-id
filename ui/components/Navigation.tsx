import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/shadcn/Navigation';
import { AppRouter } from '@/constants/router';
import { LogoSvg } from './icons/LogoSvg';
import { AccountConnect } from './account/AccountConnect';
import { Search } from './Search';

export const Navigation: IComponent = () => {
  return (
    <div className="flex items-center py-6 px-12 gap-12 border-b border-accent shadow-accent shadow-sm">
      <Link href="/">
        <LogoSvg />
      </Link>
      <div className="w-[600px]">
        <Search placeholder="Search by credential, schema, address, etc." />
      </div>
      <div className="flex justify-end items-center grow gap-4">
        <NavigationMenu>
          <NavigationMenuList>
            {Object.entries(AppRouter)
              .filter(([k]) => k !== 'Home' && k !== 'Address')
              .map(([k, v]) => (
                <NavigationMenuItem key={v}>
                  <Link href={v} passHref legacyBehavior>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {k}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
          </NavigationMenuList>
        </NavigationMenu>
        <AccountConnect />
      </div>
    </div>
  );
};
