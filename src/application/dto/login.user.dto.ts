import { z } from 'zod';

export const loginUserSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres.')
        .regex(/[a-z]/, 'Debe contener al menos una letra minúscula.')
        .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula.')
        .regex(/[0-9]/, 'Debe contener al menos un número.')
        .regex(/[\W_]/, 'Debe contener al menos un carácter especial (ej: !@#).'),
});

export type LoginUserDto = z.infer<typeof loginUserSchema>;
