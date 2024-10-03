import { z } from 'zod';

const ProjectENVSchema = z.object({
  /**
   * Feature flags, comma separated
   */
  NEXT_PUBLIC_ENV: z.string().default('development'),
  NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS: z.string().default('TN4H6cDZWdvhQqgZFfuzhWMdENC8e7Jokt'),
  NEXT_PUBLIC_SUN_ID_ADDRESS: z.string().default('TCXMiv1BJwpxu2G5XD18bbWREC2NNi9Xzk'),
  NEXT_PUBLIC_API_HOST: z.string().default('http://localhost:8080'),
  NEXT_PUBLIC_NOTIFICATION: z.string().optional(),
  NEXT_PUBLIC_BTFS_GATEWAY_URL: z.string().default(''),
  NEXT_PUBLIC_TRON_SCAN_URL: z.string().default('https://shasta.tronscan.org'),
});

/**
 * Return system ENV with parsed values
 */
export const ProjectENV = ProjectENVSchema.parse({
  NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
  NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS: process.env.NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS,
  NEXT_PUBLIC_SUN_ID_ADDRESS: process.env.NEXT_PUBLIC_SUN_ID_ADDRESS,
  NEXT_PUBLIC_API_HOST: process.env.NEXT_PUBLIC_API_HOST,
  NEXT_PUBLIC_NOTIFICATION: process.env.NEXT_PUBLIC_NOTIFICATION,
  NEXT_PUBLIC_BTFS_GATEWAY_URL: process.env.NEXT_PUBLIC_BTFS_GATEWAY_URL,
  NEXT_PUBLIC_TRON_SCAN_URL: process.env.NEXT_PUBLIC_TRON_SCAN_URL,
});
