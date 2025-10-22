import { z } from 'zod';

export const ForgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, 'Email requerido')
        .email('Formato de email inválido'),
});

export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>;
