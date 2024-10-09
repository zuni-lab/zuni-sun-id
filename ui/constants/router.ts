export const AppRouter = {
  Home: '/',
  MyCredentials: '/address',
  Schemas: '/schema',
  Credentials: '/credential',
  Address: '/address',
  Docs: '/docs',
};

export type RouterKey = keyof typeof AppRouter;

// 
export const RouterMeta: Record<RouterKey, { title: string; description?: string; icon: any }> = {
  Home: { title: 'Home', description: 'HOME', icon: null },
  MyCredentials: {
    title: 'My Credential',
    description: 'View and manage your SunID credentials.',
    icon: null,
  },
  Schemas: {
    title: 'View and Manage Credential Schemas',
    description: 'Explore all available schemas for issuing credentials on SunID.',
    icon: null,
  },
  Credentials: {
    title: 'Credential | View all SunID Credential',
    description: 'View all SunID Credential',
    icon: null,
  },
  Address: { title: 'Address', description: 'Address', icon: null },
  Docs: { title: 'Documentation', description: 'Documentation for setting up and using BTFS as a service in the SUNID platform', icon: null },
};
