import { usePathname } from 'next/navigation';
import { AppRouter, RouterKey, RouterMeta } from './router';

// eslint-disable-next-line @typescript-eslint/no-explicit-any

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

const RouterHeadings: Record<RouterKey, { title: string; descs?: string[] }> = {
  Home: {
    title: 'Welcome to SunID',
    descs: ['Securely manage and verify real-world data using the power of blockchain.'],
  },
  Schema: {
    title: 'View and Manage Credential Schemas',
    descs: [
      'Explore all available schemas for issuing credentials on SunID.',
      'Create, manage, and review schemas to securely define the structure of real-world data on the blockchain.',
    ],
  },
  Credential: {
    title: 'View and Manage Credentials',
    descs: [
      'Browse, issue, and verify credentials stored on the SunID platform.',
      'Easily manage credential data with trust and security powered by Tron and BTFS.',
    ],
  },
  Address: {
    title: 'Manage Addresses',
    descs: [
      'View and manage your associated addresses on SunID.',
      'Link and organize your addresses for credential issuance and verification.',
    ],
  },
  Docs: {
    title: 'Documentation',
    descs: [
      'Access comprehensive guides and references for using SunID.',
      'Learn how to integrate SunID with your projects and leverage its full potential.',
    ],
  },
};

export const useCurrentHeading = () => {
  const pathname = usePathname();

  const parts = pathname?.split('/');

  const parent = parts?.[1];

  if (!parent) return RouterHeadings.Home;

  if (parts.length > 2) {
    return null;
  }

  const currentRouterKey =
    (Object.keys(AppRouter).find((key) => AppRouter[key as RouterKey] === pathname) as RouterKey) ??
    'Home';

  const currentHeading = RouterHeadings[currentRouterKey];
  return currentHeading;
};
