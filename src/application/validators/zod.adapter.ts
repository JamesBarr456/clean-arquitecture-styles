import { ZodTypeAny, output } from 'zod';

export class ZodValidationError extends Error {
    public readonly issues: { field: string; message: string }[];

    constructor(issues: { field: string; message: string }[]) {
        super('Validation error');
        this.issues = issues;
    }
}

export class ZodAdapter<T extends ZodTypeAny> {
    constructor(private readonly schema: T) {}

    validate(input: unknown): output<T> {
        const result = this.schema.safeParse(input);
        if (!result.success) {
            const issues = result.error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            throw new ZodValidationError(issues);
        }
        return result.data;
    }
}
