// application/validators/Validation.ts
export interface Validation<T> {
    validate(input: unknown): T;
  }
  