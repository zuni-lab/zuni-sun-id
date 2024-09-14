import { usePathname } from 'next/navigation';

export const AppRouter = {
  Home: '/',
  Schema: '/schema',
  Credential: '/credential',
  Docs: '/docs',
};

export type RouterKey = keyof typeof AppRouter;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RouterMeta: Record<RouterKey, { title: string; description?: string; icon: any }> = {
  Home: { title: 'Home', description: 'HOME', icon: null },
  Schema: {
    title: 'Schema | View all SunID Schema',
    description: 'View all SunID Schema',
    icon: null,
  },
  Credential: {
    title: 'Credential | View all SunID Credential',
    description: 'View all SunID Credential',
    icon: null,
  },
  Docs: { title: 'Docs', description: 'Docs', icon: null },
};

/**
 * Get current router meta
 */
export const useCurrentRouterMeta = () => {
  const pathname = usePathname()?.slice(3);
  const currentRouterKey =
    (Object.keys(AppRouter).find((key) => AppRouter[key as RouterKey] === pathname) as RouterKey) ??
    'Home';
  const currentRouterMeta = RouterMeta[currentRouterKey];
  if (currentRouterMeta && currentRouterMeta.icon === null) {
    currentRouterMeta.icon = '/favicon.ico';
  }

  return { ...currentRouterMeta, key: currentRouterKey };
};
