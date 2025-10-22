import { z } from 'zod';

export const ChangePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Contraseña actual requerida'),
        newPassword: z
            .string()
            .min(8, 'La nueva contraseña debe tener al menos 8 caracteres.')
            .regex(/[a-z]/, 'Debe contener al menos una letra minúscula.')
            .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula.')
            .regex(/[0-9]/, 'Debe contener al menos un número.')
            .regex(/[\W_]/, 'Debe contener al menos un carácter especial (ej: !@#).'),
        confirmPassword: z.string().min(1, 'Confirmación de contraseña requerida'),
    })
    .refine(data => data.newPassword === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    })
    .refine(data => data.currentPassword !== data.newPassword, {
        message: 'La nueva contraseña debe ser diferente a la actual',
        path: ['newPassword'],
    });

export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;
