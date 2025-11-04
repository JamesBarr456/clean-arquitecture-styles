import { ChangePasswordUseCase } from '../change.password.user.use.case';
import { UserRepository } from '../../../../domain/repositories/user.repository';
import { EncryptService } from '../../../../domain/services/encrypt.service';
import { Validation } from '../../../validators/validation';
import { ChangePasswordDto } from '../../../dto/auth/change.password.dto';
import { UserEntity } from '../../../../domain/entities/user.entity';

// Mocks
const mockUserRepository: jest.Mocked<UserRepository> = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByResetToken: jest.fn(),
    findAll: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
};

const mockValidator: jest.Mocked<Validation<ChangePasswordDto>> = {
    validate: jest.fn(),
};

const mockEncryptService: jest.Mocked<EncryptService> = {
    hash: jest.fn(),
    compare: jest.fn(),
};

describe('ChangePasswordUseCase', () => {
    let changePasswordUseCase: ChangePasswordUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        changePasswordUseCase = new ChangePasswordUseCase(
            mockUserRepository,
            mockValidator,
            mockEncryptService
        );
    });

    describe('execute', () => {
        it('should successfully change password', async () => {
            // Arrange
            const inputData = {
                currentPassword: 'oldPassword123!',
                newPassword: 'NewPassword456@',
                confirmPassword: 'NewPassword456@',
            };

            const validatedData: ChangePasswordDto = {
                currentPassword: 'oldPassword123!',
                newPassword: 'NewPassword456@',
                confirmPassword: 'NewPassword456@',
            };

            const userId = 'user-123';
            const user = UserEntity.create({
                email: 'test@example.com',
                password: 'hashedOldPassword',
            });

            const newHashedPassword = 'hashedNewPassword';

            mockValidator.validate.mockReturnValue(validatedData);
            mockUserRepository.findById.mockResolvedValue(user);
            mockEncryptService.compare.mockResolvedValue(true);
            mockEncryptService.hash.mockResolvedValue(newHashedPassword);
            mockUserRepository.updateUser.mockResolvedValue(user);

            // Act
            const result = await changePasswordUseCase.execute(inputData, userId);

            // Assert
            expect(mockValidator.validate).toHaveBeenCalledWith(inputData);
            expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
            expect(mockEncryptService.compare).toHaveBeenCalledWith(
                validatedData.currentPassword,
                'hashedOldPassword' // La contraseña actual del usuario
            );
            expect(mockEncryptService.hash).toHaveBeenCalledWith(validatedData.newPassword);
            expect(mockUserRepository.updateUser).toHaveBeenCalledWith(userId, {
                password: newHashedPassword,
                updated_at: user.updated_at,
            });
            expect(result).toEqual({ message: 'Contraseña actualizada exitosamente' });
        });

        it('should throw error when user not found', async () => {
            // Arrange
            const inputData = {
                currentPassword: 'oldPassword123!',
                newPassword: 'NewPassword456@',
                confirmPassword: 'NewPassword456@',
            };

            const validatedData: ChangePasswordDto = {
                currentPassword: 'oldPassword123!',
                newPassword: 'NewPassword456@',
                confirmPassword: 'NewPassword456@',
            };

            const userId = 'non-existent-user';

            mockValidator.validate.mockReturnValue(validatedData);
            mockUserRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(changePasswordUseCase.execute(inputData, userId)).rejects.toThrow(
                'Usuario no encontrado'
            );

            expect(mockValidator.validate).toHaveBeenCalledWith(inputData);
            expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
            expect(mockEncryptService.compare).not.toHaveBeenCalled();
            expect(mockEncryptService.hash).not.toHaveBeenCalled();
            expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
        });

        it('should throw error when current password is incorrect', async () => {
            // Arrange
            const inputData = {
                currentPassword: 'wrongPassword',
                newPassword: 'NewPassword456@',
                confirmPassword: 'NewPassword456@',
            };

            const validatedData: ChangePasswordDto = {
                currentPassword: 'wrongPassword',
                newPassword: 'NewPassword456@',
                confirmPassword: 'NewPassword456@',
            };

            const userId = 'user-123';
            const user = UserEntity.create({
                email: 'test@example.com',
                password: 'hashedOldPassword',
            });

            mockValidator.validate.mockReturnValue(validatedData);
            mockUserRepository.findById.mockResolvedValue(user);
            mockEncryptService.compare.mockResolvedValue(false); // Wrong password

            // Act & Assert
            await expect(changePasswordUseCase.execute(inputData, userId)).rejects.toThrow(
                'Contraseña actual incorrecta'
            );

            expect(mockValidator.validate).toHaveBeenCalledWith(inputData);
            expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
            expect(mockEncryptService.compare).toHaveBeenCalledWith(
                validatedData.currentPassword,
                'hashedOldPassword' // La contraseña actual del usuario
            );
            expect(mockEncryptService.hash).not.toHaveBeenCalled();
            expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
        });

        it('should throw error when validation fails', async () => {
            // Arrange
            const invalidInput = {
                currentPassword: '',
                newPassword: '123',
                confirmPassword: '456',
            };

            const validationError = new Error(
                'Contraseña actual requerida; La nueva contraseña debe tener al menos 8 caracteres.'
            );
            mockValidator.validate.mockImplementation(() => {
                throw validationError;
            });

            // Act & Assert
            await expect(changePasswordUseCase.execute(invalidInput, 'user-123')).rejects.toThrow(
                validationError
            );

            expect(mockValidator.validate).toHaveBeenCalledWith(invalidInput);
            expect(mockUserRepository.findById).not.toHaveBeenCalled();
            expect(mockEncryptService.compare).not.toHaveBeenCalled();
            expect(mockEncryptService.hash).not.toHaveBeenCalled();
            expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
        });

        it('should throw error when hashing fails', async () => {
            // Arrange
            const inputData = {
                currentPassword: 'oldPassword123!',
                newPassword: 'NewPassword456@',
                confirmPassword: 'NewPassword456@',
            };

            const validatedData: ChangePasswordDto = {
                currentPassword: 'oldPassword123!',
                newPassword: 'NewPassword456@',
                confirmPassword: 'NewPassword456@',
            };

            const userId = 'user-123';
            const user = UserEntity.create({
                email: 'test@example.com',
                password: 'hashedOldPassword',
            });

            const hashError = new Error('Hashing failed');

            mockValidator.validate.mockReturnValue(validatedData);
            mockUserRepository.findById.mockResolvedValue(user);
            mockEncryptService.compare.mockResolvedValue(true);
            mockEncryptService.hash.mockRejectedValue(hashError);

            // Act & Assert
            await expect(changePasswordUseCase.execute(inputData, userId)).rejects.toThrow(
                hashError
            );

            expect(mockValidator.validate).toHaveBeenCalledWith(inputData);
            expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
            expect(mockEncryptService.compare).toHaveBeenCalledWith(
                validatedData.currentPassword,
                user.getPassword()
            );
            expect(mockEncryptService.hash).toHaveBeenCalledWith(validatedData.newPassword);
            expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
        });

        it('should throw error when repository update fails', async () => {
            // Arrange
            const inputData = {
                currentPassword: 'oldPassword123!',
                newPassword: 'NewPassword456@',
                confirmPassword: 'NewPassword456@',
            };

            const validatedData: ChangePasswordDto = {
                currentPassword: 'oldPassword123!',
                newPassword: 'NewPassword456@',
                confirmPassword: 'NewPassword456@',
            };

            const userId = 'user-123';
            const user = UserEntity.create({
                email: 'test@example.com',
                password: 'hashedOldPassword',
            });

            const newHashedPassword = 'hashedNewPassword';
            const updateError = new Error('Database update failed');

            mockValidator.validate.mockReturnValue(validatedData);
            mockUserRepository.findById.mockResolvedValue(user);
            mockEncryptService.compare.mockResolvedValue(true);
            mockEncryptService.hash.mockResolvedValue(newHashedPassword);
            mockUserRepository.updateUser.mockRejectedValue(updateError);

            // Act & Assert
            await expect(changePasswordUseCase.execute(inputData, userId)).rejects.toThrow(
                updateError
            );

            expect(mockValidator.validate).toHaveBeenCalledWith(inputData);
            expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
            expect(mockEncryptService.compare).toHaveBeenCalledWith(
                validatedData.currentPassword,
                'hashedOldPassword' // La contraseña actual del usuario
            );
            expect(mockEncryptService.hash).toHaveBeenCalledWith(validatedData.newPassword);
            expect(mockUserRepository.updateUser).toHaveBeenCalledWith(userId, {
                password: newHashedPassword,
                updated_at: user.updated_at,
            });
        });

        it('should update user password and timestamp', async () => {
            // Arrange
            const inputData = {
                currentPassword: 'oldPassword123!',
                newPassword: 'NewPassword456@',
                confirmPassword: 'NewPassword456@',
            };

            const validatedData: ChangePasswordDto = {
                currentPassword: 'oldPassword123!',
                newPassword: 'NewPassword456@',
                confirmPassword: 'NewPassword456@',
            };

            const userId = 'user-123';
            const user = UserEntity.create({
                email: 'test@example.com',
                password: 'hashedOldPassword',
            });

            const newHashedPassword = 'hashedNewPassword';

            mockValidator.validate.mockReturnValue(validatedData);
            mockUserRepository.findById.mockResolvedValue(user);
            mockEncryptService.compare.mockResolvedValue(true);
            mockEncryptService.hash.mockResolvedValue(newHashedPassword);
            mockUserRepository.updateUser.mockResolvedValue(user);

            // Act
            await changePasswordUseCase.execute(inputData, userId);

            // Assert
            expect(user.password).toBe(newHashedPassword);
            expect(user.updated_at).toBeInstanceOf(Date);

            const updateCall = mockUserRepository.updateUser.mock.calls[0];
            expect(updateCall[0]).toBe(userId);
            expect(updateCall[1]).toEqual({
                password: newHashedPassword,
                updated_at: user.updated_at,
            });
        });
    });
});
