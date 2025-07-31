import { z } from 'zod';

export const updateUserSchema = z.object({
    first_name: z.string().min(1, 'First name is required').optional(),
    last_name: z.string().min(1, 'Last name is required').optional(),
    email: z.string().email('Invalid email').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    dni: z.string().optional(),
    number_phone: z.string().optional(),
    avatar: z.string().optional(),
    status: z.enum(['customer', 'employee', 'admin']).optional(),
});

export type UserUpdate = z.infer<typeof updateUserSchema>;
