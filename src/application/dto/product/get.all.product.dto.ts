import { z } from "zod";

export const productQuerySchema = z.object({
  brand: z.string().optional(),

  category: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (typeof val === "string" ? val.split(",") : val))
    .optional(),

  genre: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (typeof val === "string" ? val.split(",") : val))
    .optional(),

  has_discount: z
    .string()
    .transform((val) => val === "true")
    .optional(),

  is_active: z
    .string()
    .transform((val) => val === "true")
    .optional(),

  min_price: z
    .string()
    .transform(Number)
    .refine((n) => !isNaN(n), { message: "min_price debe ser un número" })
    .optional(),

  max_price: z
    .string()
    .transform(Number)
    .refine((n) => !isNaN(n), { message: "max_price debe ser un número" })
    .optional(),

  name: z.string().optional(),

  size: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (typeof val === "string" ? val.split(",") : val))
    .optional(),

  sku: z.string().optional(),

  // Control de paginación
  page: z
    .string()
    .transform(Number)
    .refine((n) => n > 0, { message: "page debe ser mayor a 0" })
    .optional(),

  limit: z
    .string()
    .transform(Number)
    .refine((n) => n > 0, { message: "limit debe ser mayor a 0" })
    .optional(),

  sort: z.string().optional(), // Ej: 'price' o '-price'
  order: z.enum(['asc', 'desc']).optional(),
});

export type ProductFilterOptionsDTO = z.infer<typeof productQuerySchema>;