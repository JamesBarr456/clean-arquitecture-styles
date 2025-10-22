import { z } from 'zod';

export const getCustomerOrdersSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.enum(['pending', 'in_process', 'delivered', 'completed', 'canceled', 'rejected']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type GetCustomerOrdersDto = z.infer<typeof getCustomerOrdersSchema>;