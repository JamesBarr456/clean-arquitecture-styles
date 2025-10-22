import { ZodAdapter } from '../../../validators/zod.adapter';
import { ForgotPasswordSchema, ForgotPasswordDto } from '../forgot.password.dto';

describe('ForgotPasswordDto', () => {
    let validator: ZodAdapter<ForgotPasswordDto>;

    beforeEach(() => {
        validator = new ZodAdapter(ForgotPasswordSchema);
    });

    describe('validate', () => {
        it('should validate correct email', () => {
            // Arrange
            const validInput = {
                email: 'test@example.com',
            };

            // Act
            const result = validator.validate(validInput);

            // Assert
            expect(result).toEqual({ email: 'test@example.com' });
            expect(result.email).toBe('test@example.com');
        });

        it('should normalize email to lowercase', () => {
            // Arrange
            const inputWithUppercase = {
                email: 'TEST@EXAMPLE.COM',
            };

            // Act
            const result = validator.validate(inputWithUppercase);

            // Assert
            expect(result.email).toBe('test@example.com');
        });

        it('should trim whitespace from email', () => {
            // Arrange
            const inputWithWhitespace = {
                email: '  test@example.com  ',
            };

            // Act
            const result = validator.validate(inputWithWhitespace);

            // Assert
            expect(result.email).toBe('test@example.com');
        });

        it('should throw error for empty email', () => {
            // Arrange
            const invalidInput = {
                email: '',
            };

            // Act & Assert
            expect(() => validator.validate(invalidInput)).toThrow('Email requerido');
        });

        it('should throw error for missing email field', () => {
            // Arrange
            const invalidInput = {};

            // Act & Assert
            expect(() => validator.validate(invalidInput)).toThrow();
        });

        it('should throw error for invalid email format', () => {
            // Arrange
            const invalidInputs = [
                { email: 'invalid-email' },
                { email: 'test@' },
                { email: '@example.com' },
                { email: 'test.example.com' },
                { email: 'test@example' },
                { email: 'test space@example.com' },
            ];

            // Act & Assert
            invalidInputs.forEach(input => {
                expect(() => validator.validate(input)).toThrow('Formato de email inválido');
            });
        });

        it('should accept various valid email formats', () => {
            // Arrange
            const validEmails = [
                'user@domain.com',
                'user.name@domain.com',
                'user+tag@domain.com',
                'user123@domain123.com',
                'user@subdomain.domain.com',
                'a@b.co',
                'test.email.with+symbol@example.com',
            ];

            // Act & Assert
            validEmails.forEach(email => {
                const input = { email };
                expect(() => validator.validate(input)).not.toThrow();
                const result = validator.validate(input);
                expect(result.email).toBe(email.toLowerCase());
            });
        });

        it('should handle null input', () => {
            // Arrange
            const invalidInput = null;

            // Act & Assert
            expect(() => validator.validate(invalidInput)).toThrow();
        });

        it('should handle undefined input', () => {
            // Arrange
            const invalidInput = undefined;

            // Act & Assert
            expect(() => validator.validate(invalidInput)).toThrow();
        });

        it('should handle non-object input', () => {
            // Arrange
            const invalidInputs = ['string', 123, true, []];

            // Act & Assert
            invalidInputs.forEach(input => {
                expect(() => validator.validate(input)).toThrow();
            });
        });

        it('should handle complex email normalization', () => {
            // Arrange
            const complexInput = {
                email: '  USER.Name+Tag@SUBDOMAIN.EXAMPLE.COM  ',
            };

            // Act
            const result = validator.validate(complexInput);

            // Assert
            expect(result.email).toBe('user.name+tag@subdomain.example.com');
        });
    });
});
