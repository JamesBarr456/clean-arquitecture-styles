import { z } from 'zod';

export const getCustomerStatsSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  period: z.enum(['monthly', 'quarterly', 'yearly', 'all']).default('all'),
});

export type GetCustomerStatsDto = z.infer<typeof getCustomerStatsSchema>;