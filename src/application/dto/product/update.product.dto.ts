import { z } from "zod";
import { GenreEnum } from "./create.product.dto";
export const updateProductDto = z.object({
  sku: z.string().min(1, "SKU is required").optional(),
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  sale_price: z.preprocess(
    (val) => val === "" ? undefined : Number(val),
    z.number().nonnegative("Price must be a non-negative number")
  ).optional(),
  category: z.array(z.string()).optional(),
  size: z.array(z.string()).optional(), // Ej: ['M', 'L']
  cost_price: z.preprocess(
    (val) => val === "" ? undefined : Number(val),
    z.number().nonnegative("Cost price must be a non-negative number").optional()
  ),
  has_discount: z.preprocess(
    (val) => val === "true" ? true : val === "false" ? false : val,
    z.boolean().optional()
  ),
  discount_percentage: z.preprocess(
    (val) => val === "" ? undefined : Number(val),
    z.number().min(0).max(100).optional()
  ),
  stock: z.preprocess(
    (val) => val === "" ? undefined : Number(val),
    z.number().int().nonnegative("Stock must be a non-negative integer").optional()
  ),
  images: z.array(z.string().url()).optional(),

 
  genre: GenreEnum.optional().refine(
    (val) => !val || GenreEnum.options.includes(val),
    {
      message: "El género debe ser uno de: unisex, male, female o kids",
    }
  ),
  brand: z.string().min(1).optional(),
  discount: z.preprocess(
    (val) => val === "" ? undefined : Number(val),
    z.number().min(0).max(100).optional()
  ),
  is_active:  z.preprocess(
    (val) => val === "true" ? true : val === "false" ? false : val,
    z.boolean().optional()
  ),
});

export type UpdateProductdDTO = z.infer<typeof updateProductDto>