import { z } from 'zod';

const ProjectENVSchema = z.object({
  /**
   * Feature flags, comma separated
   */
  NEXT_PUBLIC_ENV: z.string().default('development'),
  NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS: z.string().default('TWNVf1Ex7kkr6xwCT1cS5Cpt8HkB8aXHdn'),
  NEXT_PUBLIC_SUN_ID_ADDRESS: z.string().default('TKEySZ8z5r8EciU9dzvhrovm4FgstGaZQA'),
  NEXT_PUBLIC_TRON_PROVIDER: z.string().default('https://api.shasta.trongrid.io'),
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
