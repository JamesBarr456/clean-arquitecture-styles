import { z } from 'zod';

export const RegisterUserSchema = z.object({
    first_name: z.string().min(1, 'El nombre es obligatorio'),
    last_name: z.string().min(1, 'El apellido es obligatorio'),
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
