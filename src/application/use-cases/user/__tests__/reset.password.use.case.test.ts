import { ResetPasswordUseCase } from '../reset.password.user.use.case';
import { UserRepository } from '../../../../domain/repositories/user.repository';
import { EncryptService } from '../../../../domain/services/encrypt.service';
import { EmailService } from '../../../../domain/services/email.service';
import { Validation } from '../../../validators/validation';
import { ResetPasswordDto } from '../../../dto/auth/reset.password.dto';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { CustomError } from '../../../../domain/errors/custom.error';

// Mocks
const mockUserRepository: jest.Mocked<UserRepository> = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByResetToken: jest.fn(),
    findAll: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
};

const mockEncryptService: jest.Mocked<EncryptService> = {
    hash: jest.fn(),
    compare: jest.fn(),
};

const mockEmailService = {
    sendPasswordResetEmail: jest.fn(),
    sendPasswordChangedNotification: jest.fn(),
    sendWelcomeEmail: jest.fn(),
} as jest.Mocked<EmailService>;

const mockValidator: jest.Mocked<Validation<ResetPasswordDto>> = {
    validate: jest.fn(),
};

describe('ResetPasswordUseCase', () => {
    let resetPasswordUseCase: ResetPasswordUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        resetPasswordUseCase = new ResetPasswordUseCase(
            mockUserRepository,
            mockEncryptService,
            mockValidator,
            mockEmailService
        );
    });

    describe('execute', () => {
        it('should reset password successfully for valid token', async () => {
            // Arrange
            const inputData = {
                token: 'abc123',
                newPassword: 'NewPassword123!',
                confirmPassword: 'NewPassword123!',
            };

            const validatedData: ResetPasswordDto = {
                token: 'abc123',
                newPassword: 'NewPassword123!',
                confirmPassword: 'NewPassword123!',
            };

            const user = UserEntity.create({
                email: 'test@example.com',
                password: 'oldHashedPassword',
                status: 'active',
            });

            // Establecer token válido
            user.setResetPasswordToken('abc123', 60);

            const newHashedPassword = 'newHashedPassword';

            mockValidator.validate.mockReturnValue(validatedData);
            mockUserRepository.findByResetToken.mockResolvedValue(user);
            mockEncryptService.compare.mockResolvedValue(false); // Nueva contraseña diferente
            mockEncryptService.hash.mockResolvedValue(newHashedPassword);
            mockUserRepository.updateUser.mockResolvedValue(user);

            // Act
            const result = await resetPasswordUseCase.execute(inputData);

            // Assert
            expect(mockValidator.validate).toHaveBeenCalledWith(inputData);
            expect(mockUserRepository.findByResetToken).toHaveBeenCalledWith(validatedData.token);
            expect(mockEncryptService.compare).toHaveBeenCalledWith(
                validatedData.newPassword,
                'oldHashedPassword'
            );
            expect(mockEncryptService.hash).toHaveBeenCalledWith(validatedData.newPassword);
            expect(mockUserRepository.updateUser).toHaveBeenCalledWith(
                user.user_id,
                expect.objectContaining({
                    password: newHashedPassword,
                    reset_password_token: undefined,
                    reset_password_expires: undefined,
                    updated_at: expect.any(Date),
                })
            );
            expect(mockEmailService.sendPasswordChangedNotification).toHaveBeenCalledWith(
                user.email,
                user.first_name
            );
            expect(result.message).toBe('Contraseña restablecida exitosamente');
        });

        it('should throw error for invalid token', async () => {
            // Arrange
            const inputData = {
                token: 'invalid-token',
                newPassword: 'NewPassword123!',
                confirmPassword: 'NewPassword123!',
            };

            const validatedData: ResetPasswordDto = {
                token: 'invalid-token',
                newPassword: 'NewPassword123!',
                confirmPassword: 'NewPassword123!',
            };

            mockValidator.validate.mockReturnValue(validatedData);
            mockUserRepository.findByResetToken.mockResolvedValue(null);

            // Act & Assert
            await expect(resetPasswordUseCase.execute(inputData)).rejects.toThrow(
                CustomError.badRequest('Token inválido o expirado')
            );

            expect(mockValidator.validate).toHaveBeenCalledWith(inputData);
            expect(mockUserRepository.findByResetToken).toHaveBeenCalledWith(validatedData.token);
            expect(mockEncryptService.compare).not.toHaveBeenCalled();
            expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
        });

        it('should throw error for expired token', async () => {
            // Arrange
            const inputData = {
                token: 'expired-token',
                newPassword: 'NewPassword123!',
                confirmPassword: 'NewPassword123!',
            };

            const validatedData: ResetPasswordDto = {
                token: 'expired-token',
                newPassword: 'NewPassword123!',
                confirmPassword: 'NewPassword123!',
            };

            const user = UserEntity.create({
                email: 'test@example.com',
                password: 'oldHashedPassword',
                status: 'active',
            });

            // Establecer token expirado
            user.reset_password_token = 'expired-token';
            user.reset_password_expires = new Date(Date.now() - 1000); // Expirado hace 1 segundo

            mockValidator.validate.mockReturnValue(validatedData);
            mockUserRepository.findByResetToken.mockResolvedValue(user);
            mockUserRepository.updateUser.mockResolvedValue(user);

            // Act & Assert
            await expect(resetPasswordUseCase.execute(inputData)).rejects.toThrow(
                CustomError.badRequest('Token inválido o expirado')
            );

            expect(mockValidator.validate).toHaveBeenCalledWith(inputData);
            expect(mockUserRepository.findByResetToken).toHaveBeenCalledWith(validatedData.token);
            expect(mockUserRepository.updateUser).toHaveBeenCalledWith(
                user.user_id,
                expect.objectContaining({
                    reset_password_token: undefined,
                    reset_password_expires: undefined,
                })
            );
        });

        it('should throw error for inactive user', async () => {
            // Arrange
            const inputData = {
                token: 'valid-token',
                newPassword: 'NewPassword123!',
                confirmPassword: 'NewPassword123!',
            };

            const validatedData: ResetPasswordDto = {
                token: 'valid-token',
                newPassword: 'NewPassword123!',
                confirmPassword: 'NewPassword123!',
            };

            const user = UserEntity.create({
                email: 'test@example.com',
                password: 'oldHashedPassword',
                status: 'inactive',
            });

            user.setResetPasswordToken('valid-token', 60);

            mockValidator.validate.mockReturnValue(validatedData);
            mockUserRepository.findByResetToken.mockResolvedValue(user);

            // Act & Assert
            await expect(resetPasswordUseCase.execute(inputData)).rejects.toThrow(
                CustomError.badRequest('Usuario inactivo')
            );

            expect(mockValidator.validate).toHaveBeenCalledWith(inputData);
            expect(mockUserRepository.findByResetToken).toHaveBeenCalledWith(validatedData.token);
            expect(mockEncryptService.compare).not.toHaveBeenCalled();
        });

        it('should throw error when new password equals current password', async () => {
            // Arrange
            const inputData = {
                token: 'valid-token',
                newPassword: 'SamePassword123!',
                confirmPassword: 'SamePassword123!',
            };

            const validatedData: ResetPasswordDto = {
                token: 'valid-token',
                newPassword: 'SamePassword123!',
                confirmPassword: 'SamePassword123!',
            };

            const user = UserEntity.create({
                email: 'test@example.com',
                password: 'currentHashedPassword',
                status: 'active',
            });

            user.setResetPasswordToken('valid-token', 60);

            mockValidator.validate.mockReturnValue(validatedData);
            mockUserRepository.findByResetToken.mockResolvedValue(user);
            mockEncryptService.compare.mockResolvedValue(true); // Misma contraseña

            // Act & Assert
            await expect(resetPasswordUseCase.execute(inputData)).rejects.toThrow(
                CustomError.badRequest('La nueva contraseña debe ser diferente a la actual')
            );

            expect(mockValidator.validate).toHaveBeenCalledWith(inputData);
            expect(mockUserRepository.findByResetToken).toHaveBeenCalledWith(validatedData.token);
            expect(mockEncryptService.compare).toHaveBeenCalledWith(
                validatedData.newPassword,
                'currentHashedPassword'
            );
            expect(mockEncryptService.hash).not.toHaveBeenCalled();
        });

        it('should handle email notification failure gracefully', async () => {
            // Arrange
            const inputData = {
                token: 'valid-token',
                newPassword: 'NewPassword123!',
                confirmPassword: 'NewPassword123!',
            };

            const validatedData: ResetPasswordDto = {
                token: 'valid-token',
                newPassword: 'NewPassword123!',
                confirmPassword: 'NewPassword123!',
            };

            const user = UserEntity.create({
                email: 'test@example.com',
                password: 'oldHashedPassword',
                status: 'active',
            });

            user.setResetPasswordToken('valid-token', 60);

            const newHashedPassword = 'newHashedPassword';

            mockValidator.validate.mockReturnValue(validatedData);
            mockUserRepository.findByResetToken.mockResolvedValue(user);
            mockEncryptService.compare.mockResolvedValue(false);
            mockEncryptService.hash.mockResolvedValue(newHashedPassword);
            mockUserRepository.updateUser.mockResolvedValue(user);
            (mockEmailService.sendPasswordChangedNotification as jest.Mock).mockRejectedValue(
                new Error('Email failed')
            );

            // Act
            const result = await resetPasswordUseCase.execute(inputData);

            // Assert
            expect(result.message).toBe('Contraseña restablecida exitosamente');
            expect(mockEmailService.sendPasswordChangedNotification).toHaveBeenCalled();
        });

        it('should throw error when validation fails', async () => {
            // Arrange
            const invalidInput = {
                token: '',
                newPassword: 'weak',
                confirmPassword: 'different',
            };

            const validationError = new Error('Validation failed');
            mockValidator.validate.mockImplementation(() => {
                throw validationError;
            });

            // Act & Assert
            await expect(resetPasswordUseCase.execute(invalidInput)).rejects.toThrow(
                validationError
            );

            expect(mockValidator.validate).toHaveBeenCalledWith(invalidInput);
            expect(mockUserRepository.findByResetToken).not.toHaveBeenCalled();
        });
    });
});
