import { z } from 'zod';

export const updateCustomerSchema = z.object({
  address: z.object({
    street: z.string().min(1),
    locality: z.string().min(1),
    city: z.string().min(1),
    province: z.string().min(1),
    postal_code: z.string().optional(),
    is_default: z.boolean().optional(),
  }).optional(),
  risk_profile: z.object({
    reliability_score: z.number().min(0).max(100).optional(),
    has_issues: z.boolean().optional(),
    block_reason: z.string().optional(),
  }).optional(),
});

export type UpdateCustomerDto = z.infer<typeof updateCustomerSchema>;