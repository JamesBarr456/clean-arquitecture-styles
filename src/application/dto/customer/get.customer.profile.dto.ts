import { z } from 'zod';

export const getCustomerProfileSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

export type GetCustomerProfileDto = z.infer<typeof getCustomerProfileSchema>;