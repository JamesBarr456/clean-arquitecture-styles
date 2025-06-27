// infrastructure/validators/ZodAdapter.ts
import { ZodSchema } from 'zod';
import { Validation } from './validation';


export class ZodAdapter<T> implements Validation<T> {
  constructor(private readonly schema: ZodSchema<T>) {}

  validate(input: unknown): T {
    const result = this.schema.safeParse(input);
    if (!result.success) {
      throw new Error(result.error.errors.map(e => e.message).join('; '));
    }
    return result.data;
  }
}
