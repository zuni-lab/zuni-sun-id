import { usePathname } from 'next/navigation';

export const AppRouter = {
  Home: '/',
};

export type RouterKey = keyof typeof AppRouter;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RouterMeta: Record<RouterKey, { title: string; description?: string; icon: any }> = {
  Home: { title: 'Home', description: 'HOME', icon: null },
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
