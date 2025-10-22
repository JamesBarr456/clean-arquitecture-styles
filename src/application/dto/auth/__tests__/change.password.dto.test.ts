import { ZodAdapter } from '../../../validators/zod.adapter';
import { ChangePasswordSchema, ChangePasswordDto } from '../change.password.dto';

describe('ChangePasswordDto', () => {
    let validator: ZodAdapter<ChangePasswordDto>;

    beforeEach(() => {
        validator = new ZodAdapter(ChangePasswordSchema);
    });

    describe('validate', () => {
        it('should validate correct change password data', () => {
            // Arrange
            const validInput = {
                currentPassword: 'OldPassword123!',
                newPassword: 'NewPassword456@',
                confirmPassword: 'NewPassword456@',
            };

            // Act
            const result = validator.validate(validInput);

            // Assert
            expect(result).toEqual(validInput);
            expect(result.currentPassword).toBe(validInput.currentPassword);
            expect(result.newPassword).toBe(validInput.newPassword);
            expect(result.confirmPassword).toBe(validInput.confirmPassword);
        });

        it('should throw error for missing current password', () => {
            // Arrange
            const invalidInput = {
                currentPassword: '',
                newPassword: 'NewPassword456@',
                confirmPassword: 'NewPassword456@',
            };

            // Act & Assert
            expect(() => validator.validate(invalidInput)).toThrow('Contraseña actual requerida');
        });

        it('should throw error for weak new password', () => {
            // Arrange
            const invalidInput = {
                currentPassword: 'OldPassword123!',
                newPassword: 'weak',
                confirmPassword: 'weak',
            };

            // Act & Assert
            expect(() => validator.validate(invalidInput)).toThrow(
                'La nueva contraseña debe tener al menos 8 caracteres'
            );
        });

        it('should throw error for new password without lowercase', () => {
            // Arrange
            const invalidInput = {
                currentPassword: 'OldPassword123!',
                newPassword: 'NEWPASSWORD456@',
                confirmPassword: 'NEWPASSWORD456@',
            };

            // Act & Assert
            expect(() => validator.validate(invalidInput)).toThrow(
                'Debe contener al menos una letra minúscula'
            );
        });

        it('should throw error for new password without uppercase', () => {
            // Arrange
            const invalidInput = {
                currentPassword: 'OldPassword123!',
                newPassword: 'newpassword456@',
                confirmPassword: 'newpassword456@',
            };

            // Act & Assert
            expect(() => validator.validate(invalidInput)).toThrow(
                'Debe contener al menos una letra mayúscula'
            );
        });

        it('should throw error for new password without number', () => {
            // Arrange
            const invalidInput = {
                currentPassword: 'OldPassword123!',
                newPassword: 'NewPassword@',
                confirmPassword: 'NewPassword@',
            };

            // Act & Assert
            expect(() => validator.validate(invalidInput)).toThrow(
                'Debe contener al menos un número'
            );
        });

        it('should throw error for new password without special character', () => {
            // Arrange
            const invalidInput = {
                currentPassword: 'OldPassword123!',
                newPassword: 'NewPassword456',
                confirmPassword: 'NewPassword456',
            };

            // Act & Assert
            expect(() => validator.validate(invalidInput)).toThrow(
                'Debe contener al menos un carácter especial'
            );
        });

        it('should throw error when passwords do not match', () => {
            // Arrange
            const invalidInput = {
                currentPassword: 'OldPassword123!',
                newPassword: 'NewPassword456@',
                confirmPassword: 'DifferentPassword789#',
            };

            // Act & Assert
            expect(() => validator.validate(invalidInput)).toThrow('Las contraseñas no coinciden');
        });

        it('should throw error when new password is same as current', () => {
            // Arrange
            const invalidInput = {
                currentPassword: 'SamePassword123!',
                newPassword: 'SamePassword123!',
                confirmPassword: 'SamePassword123!',
            };

            // Act & Assert
            expect(() => validator.validate(invalidInput)).toThrow(
                'La nueva contraseña debe ser diferente a la actual'
            );
        });

        it('should throw error for missing confirmation password', () => {
            // Arrange
            const invalidInput = {
                currentPassword: 'OldPassword123!',
                newPassword: 'NewPassword456@',
                confirmPassword: '',
            };

            // Act & Assert
            expect(() => validator.validate(invalidInput)).toThrow(
                'Confirmación de contraseña requerida'
            );
        });

        it('should handle complex valid password patterns', () => {
            // Arrange
            const validInputs = [
                {
                    currentPassword: 'Old123!@#',
                    newPassword: 'MyNewP@ssw0rd!',
                    confirmPassword: 'MyNewP@ssw0rd!',
                },
                {
                    currentPassword: 'Current_Pass1',
                    newPassword: 'Str0ng#P@$$w0rd',
                    confirmPassword: 'Str0ng#P@$$w0rd',
                },
                {
                    currentPassword: 'Test123!',
                    newPassword: 'ComplexP@ssword2024!',
                    confirmPassword: 'ComplexP@ssword2024!',
                },
            ];

            // Act & Assert
            validInputs.forEach(input => {
                expect(() => validator.validate(input)).not.toThrow();
                const result = validator.validate(input);
                expect(result).toEqual(input);
            });
        });

        it('should throw error for multiple validation failures', () => {
            // Arrange
            const invalidInput = {
                currentPassword: '',
                newPassword: 'weak',
                confirmPassword: 'different',
            };

            // Act & Assert
            expect(() => validator.validate(invalidInput)).toThrow();

            // Verify that it contains multiple error messages
            try {
                validator.validate(invalidInput);
            } catch (error: any) {
                expect(error.message).toContain('Contraseña actual requerida');
                expect(error.message).toContain(
                    'La nueva contraseña debe tener al menos 8 caracteres'
                );
            }
        });
    });
});
