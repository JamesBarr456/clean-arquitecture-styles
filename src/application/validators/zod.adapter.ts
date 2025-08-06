// infrastructure/validators/ZodAdapter.ts
import { output, ZodTypeAny } from 'zod';
import { Validation } from './validation';


export class ZodAdapter<T extends ZodTypeAny> implements Validation<output<T>> {
  constructor(private readonly schema: T) {}

  validate(input: unknown): output<T> {
    const result = this.schema.safeParse(input);
    if (!result.success) {
      throw new Error(result.error.errors.map(e => e.message).join('; '));
    }
    return result.data;
  }
}
