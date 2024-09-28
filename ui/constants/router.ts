export const AppRouter = {
  Home: '/',
  Schema: '/schema',
  Address: '/address',
  Credential: '/credential',
  Docs: '/docs',
};

export type RouterKey = keyof typeof AppRouter;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RouterMeta: Record<RouterKey, { title: string; description?: string; icon: any }> = {
  Home: { title: 'Home', description: 'HOME', icon: null },
  Schema: {
    title: 'View and Manage Credential Schemas',
    description: 'Explore all available schemas for issuing credentials on SunID.',
    icon: null,
  },
  Credential: {
    title: 'Credential | View all SunID Credential',
    description: 'View all SunID Credential',
    icon: null,
  },
  Address: { title: 'Address', description: 'Address', icon: null },
  Docs: { title: 'Docs', description: 'Docs', icon: null },
};
