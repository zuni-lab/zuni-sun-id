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
    <div className="flex items-center py-6 px-16 gap-12 border-b border-accent shadow-accent shadow-sm">
      <Link href="/">
        <LogoSvg className="text-white" />
      </Link>
      <div className="grow">
        <Search
          onSearchChange={(val) => {
            console.log({ val });
          }}
          placeholder="Search by credential, schema, address, etc."
        />
      </div>
      <div className="w-1/3 flex justify-end items-center pr-4">
        <NavigationMenu>
          <NavigationMenuList>
            {Object.entries(AppRouter)
              .filter(([k]) => k !== 'Home' && k !== 'Vaults')
              .map(([k, v]) => (
                <NavigationMenuItem key={v}>
                  <Link href={v} passHref legacyBehavior>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {k}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            <NavigationMenuItem className="pl-8 flex justify-end">
              <div className="w-max">
                <AccountConnect />
              </div>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};
