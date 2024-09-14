import { z } from 'zod';

const ProjectENVSchema = z.object({
  /**
   * Feature flags, comma separated
   */
  NEXT_PUBLIC_ENV: z.string().default('development'),
  NEXT_PUBLIC_TRON_PROVIDER: z.string().default('https://api.shasta.trongrid.io'),
  NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS: z.string().default('TN4H6cDZWdvhQqgZFfuzhWMdENC8e7Jokt'),
  NEXT_PUBLIC_SUN_ID_ADDRESS: z.string().default('TCXMiv1BJwpxu2G5XD18bbWREC2NNi9Xzk'),
});

/**
 * Return system ENV with parsed values
 */
export const ProjectENV = ProjectENVSchema.parse({
  NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
  NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS: process.env.NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS,
  NEXT_PUBLIC_SUN_ID_ADDRESS: process.env.NEXT_PUBLIC_SUN_ID_ADDRESS,
  NEXT_PUBLIC_TRON_PROVIDER: process.env.NEXT_PUBLIC_TRON_PROVIDER,
});
