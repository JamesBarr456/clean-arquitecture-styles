import { z } from 'zod';
import { ZodAdapter } from './zod.adapter';
import { ResetPasswordDto } from '../dto/auth/reset.password.dto';

const ResetPasswordSchema = z
    .object({
        token: z
            .string({ required_error: 'El token es requerido' })
            .trim()
            .min(1, 'El token no puede estar vacío')
            .length(6, 'Token inválido'),

        newPassword: z
            .string({ required_error: 'La nueva contraseña es requerida' })
            .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
            .regex(/[A-Z]/, 'La nueva contraseña debe tener al menos una mayúscula')
            .regex(/[a-z]/, 'La nueva contraseña debe tener al menos una minúscula')
            .regex(/[0-9]/, 'La nueva contraseña debe tener al menos un número')
            .regex(/[^A-Za-z0-9]/, 'La nueva contraseña debe tener al menos un carácter especial'),

        confirmPassword: z.string({ required_error: 'La confirmación de contraseña es requerida' }),
    })
    .refine(data => data.newPassword === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

export const resetPasswordValidator = new ZodAdapter<ResetPasswordDto>(ResetPasswordSchema);
