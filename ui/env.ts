import { z } from 'zod';

const ProjectENVSchema = z.object({
  /**
   * Feature flags, comma separated
   */
  NEXT_PUBLIC_ENV: z.string().default('development'),
});

/**
 * Return system ENV with parsed values
 */
export const ProjectENV = ProjectENVSchema.parse({
  NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
});
