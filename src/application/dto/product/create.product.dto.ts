import { z } from "zod";

 export const GenreEnum = z.enum(['unisex', 'male', 'female', 'kids']);

export const createProductDto = z.object({
  sku: z.string().min(1, "SKU is required"),
  brand: z.string().min(1, "Brand is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1).optional(),

  cost_price: z.preprocess(
    (val) => val === "" ? undefined : Number(val),
    z.number().nonnegative("Cost price must be a non-negative number")
  ),

  has_discount: z.preprocess(
    (val) => val === "true" ? true : val === "false" ? false : val,
    z.boolean().optional()
  ),

  discount_percentage: z.preprocess(
    (val) => val === "" ? undefined : Number(val),
    z.number().min(0).max(100).optional()
  ),

  discount: z.preprocess(
    (val) => val === "" ? undefined : Number(val),
    z.number().min(0).max(100).optional()
  ),

  sale_price: z.preprocess(
    (val) => val === "" ? undefined : Number(val),
    z.number().nonnegative("Price must be a non-negative number")
  ),

  stock: z.preprocess(
    (val) => val === "" ? undefined : Number(val),
    z.number().int().nonnegative("Stock must be a non-negative integer").optional()
  ),

  size: z.array(z.string()), // Ej: ['M', 'L']
  
  category: z.array(z.string()).optional(), // Ej: ['electronics', 'clothing']
  
  images: z.array(z.string().url()).optional(),

   genre: z
    .array(z.enum(['male', 'female', 'unisex', "kids"]))
    .default(['unisex']), // Valor por defecto

});


export type CreateProductDTO = z.infer<typeof createProductDto>;