import { ZodAdapter } from '../zod.adapter';
import { RegisterUserSchema, RegisterUserDto } from '../../dto/auth/register.auth.dto';
import { z } from 'zod';

describe('ZodAdapter', () => {
    let validator: ZodAdapter<RegisterUserDto>;

    beforeEach(() => {
        validator = new ZodAdapter(RegisterUserSchema);
    });

    describe('validate', () => {
        it('should validate correct input data', () => {
            // Arrange
            const validInput = {
                email: 'test@example.com',
                password: 'Password123!',
            };

            // Act
            const result = validator.validate(validInput);

            // Assert
            expect(result).toEqual(validInput);
            expect(result.email).toBe(validInput.email);
            expect(result.password).toBe(validInput.password);
        });

        it('should throw error for invalid email', () => {
            // Arrange
            const invalidInput = {
                email: 'invalid-email',
                password: 'Password123!',
            };

            // Act & Assert
            expect(() => validator.validate(invalidInput)).toThrow('Email inválido');
        });

        it('should throw error for short password', () => {
            // Arrange
            const invalidInput = {
                email: 'test@example.com',
                password: '123',
            };

            // Act & Assert
            expect(() => validator.validate(invalidInput)).toThrow(
                'La contraseña debe tener al menos 8 caracteres'
            );
        });

        it('should throw error for password without lowercase', () => {
            // Arrange
            const invalidInput = {
                email: 'test@example.com',
                password: 'PASSWORD123!',
            };

            // Act & Assert
            expect(() => validator.validate(invalidInput)).toThrow(
                'Debe contener al menos una letra minúscula'
            );
        });

        it('should throw error for password without uppercase', () => {
            // Arrange
            const invalidInput = {
                email: 'test@example.com',
                password: 'password123!',
            };

            // Act & Assert
            expect(() => validator.validate(invalidInput)).toThrow(
                'Debe contener al menos una letra mayúscula'
            );
        });

        it('should throw error for password without number', () => {
            // Arrange
            const invalidInput = {
                email: 'test@example.com',
                password: 'Password!',
            };

            // Act & Assert
            expect(() => validator.validate(invalidInput)).toThrow(
                'Debe contener al menos un número'
            );
        });

        it('should throw error for password without special character', () => {
            // Arrange
            const invalidInput = {
                email: 'test@example.com',
                password: 'Password123',
            };

            // Act & Assert
            expect(() => validator.validate(invalidInput)).toThrow(
                'Debe contener al menos un carácter especial'
            );
        });

        it('should throw multiple validation errors combined', () => {
            // Arrange
            const invalidInput = {
                email: 'invalid-email',
                password: '123',
            };

            // Act & Assert
            expect(() => validator.validate(invalidInput)).toThrow(
                /Email inválido.*La contraseña debe tener al menos 8 caracteres/
            );
        });

        it('should handle missing fields', () => {
            // Arrange
            const invalidInput = {};

            // Act & Assert
            expect(() => validator.validate(invalidInput)).toThrow();
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

        it('should accept valid complex password', () => {
            // Arrange
            const validInput = {
                email: 'user@domain.com',
                password: 'MySecureP@ssw0rd!',
            };

            // Act
            const result = validator.validate(validInput);

            // Assert
            expect(result).toEqual(validInput);
        });

        it('should work with different schema types', () => {
            // Arrange
            const testSchema = z.object({
                name: z.string().min(1, 'Name is required'),
                age: z.number().min(0, 'Age must be positive'),
            });

            const testValidator = new ZodAdapter(testSchema);
            const validInput = {
                name: 'John',
                age: 25,
            };

            // Act
            const result = testValidator.validate(validInput);

            // Assert
            expect(result).toEqual(validInput);
        });

        it('should preserve error messages from schema', () => {
            // Arrange
            const customSchema = z.object({
                customField: z.string().min(5, 'Custom error message'),
            });

            const customValidator = new ZodAdapter(customSchema);
            const invalidInput = {
                customField: 'ab',
            };

            // Act & Assert
            expect(() => customValidator.validate(invalidInput)).toThrow('Custom error message');
        });
    });
});
