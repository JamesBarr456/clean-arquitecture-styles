import { z } from "zod";

export const RegisterUserSchema = z.object({
    first_name: z.string().min(1, 'El nombre es obligatorio'),
    last_name: z.string().min(1, 'El apellido es obligatorio'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  
    dni: z.string().optional(),
    number_phone: z.string().optional(),
  
    created_at: z.coerce.date().optional(), // coerce transforma string a Date si se puede
    updated_at: z.coerce.date().optional(),
  
    id: z.string().optional(),
    avatar: z.string().url('URL de avatar inválida').optional(),
  });

export type RegisterUserDto = z.infer<typeof RegisterUserSchema>;