import { z } from 'zod';

export const RegisterUserSchema = z.object({
    first_name: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede exceder 50 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
    last_name: z
        .string()
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .max(50, 'El apellido no puede exceder 50 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras y espacios'),
    email: z.string().email('Email inválido'),
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres.')
        .regex(/[a-z]/, 'Debe contener al menos una letra minúscula.')
        .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula.')
        .regex(/[0-9]/, 'Debe contener al menos un número.')
        .regex(/[\W_]/, 'Debe contener al menos un carácter especial (ej: !@#).'),
});

export type RegisterUserDto = z.infer<typeof RegisterUserSchema>;
