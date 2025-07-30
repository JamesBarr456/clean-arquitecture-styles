import { z } from 'zod';

export const getAllUsersSchema = z.object({
  status: z.enum(['admin', 'employee', 'customer']).optional(),
  first_name: z.string().min(1,).optional(),
  last_name: z.string().min(1,).optional(),
  page: z.coerce.number().min(1).optional(),
  sortBy: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  // search: z.string().optional(),
});

export type UserFilterOptions = z.infer<typeof getAllUsersSchema>;
