import { ForgotPasswordUseCase } from '../forgot.password.use.case';
import { UserRepository } from '../../../../domain/repositories/user.repository';
import { Validation } from '../../../validators/validation';
import { ForgotPasswordDto } from '../../../dto/auth/forgot.password.dto';
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

const mockValidator: jest.Mocked<Validation<ForgotPasswordDto>> = {
    validate: jest.fn(),
};

describe('ForgotPasswordUseCase', () => {
    let forgotPasswordUseCase: ForgotPasswordUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        forgotPasswordUseCase = new ForgotPasswordUseCase(mockUserRepository, mockValidator);
    });

    describe('execute', () => {
        const successMessage =
            'Si el email está registrado, recibirás un enlace para restablecer tu contraseña';

        it('should generate reset token for valid active user', async () => {
            // Arrange
            const inputData = {
                email: 'test@example.com',
            };

            const validatedData: ForgotPasswordDto = {
                email: 'test@example.com',
            };

            const user = UserEntity.create({
                email: 'test@example.com',
                password: 'hashedPassword',
                status: 'active',
            });

            mockValidator.validate.mockReturnValue(validatedData);
            mockUserRepository.findByEmail.mockResolvedValue(user);
            mockUserRepository.updateUser.mockResolvedValue(user);

            // Act
            const result = await forgotPasswordUseCase.execute(inputData);

            // Assert
            expect(mockValidator.validate).toHaveBeenCalledWith(inputData);
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validatedData.email);
            expect(mockUserRepository.updateUser).toHaveBeenCalledWith(
                user.user_id,
                expect.objectContaining({
                    reset_password_token: expect.any(String),
                    reset_password_expires: expect.any(Date),
                    updated_at: expect.any(Date),
                })
            );
            expect(result.message).toBe(successMessage);
            expect(result.token).toBeDefined();
            expect(typeof result.token).toBe('string');
            expect(result.token).toHaveLength(6); // 3 bytes hex = 6 characters
        });

        it('should return success message when user does not exist', async () => {
            // Arrange
            const inputData = {
                email: 'nonexistent@example.com',
            };

            const validatedData: ForgotPasswordDto = {
                email: 'nonexistent@example.com',
            };

            mockValidator.validate.mockReturnValue(validatedData);
            mockUserRepository.findByEmail.mockResolvedValue(null);

            // Act
            const result = await forgotPasswordUseCase.execute(inputData);

            // Assert
            expect(mockValidator.validate).toHaveBeenCalledWith(inputData);
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validatedData.email);
            expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
            expect(result.message).toBe(successMessage);
            expect(result.token).toBeUndefined();
        });

        it('should return success message for inactive user', async () => {
            // Arrange
            const inputData = {
                email: 'inactive@example.com',
            };

            const validatedData: ForgotPasswordDto = {
                email: 'inactive@example.com',
            };

            const inactiveUser = UserEntity.create({
                email: 'inactive@example.com',
                password: 'hashedPassword',
                status: 'inactive',
            });

            mockValidator.validate.mockReturnValue(validatedData);
            mockUserRepository.findByEmail.mockResolvedValue(inactiveUser);

            // Act
            const result = await forgotPasswordUseCase.execute(inputData);

            // Assert
            expect(mockValidator.validate).toHaveBeenCalledWith(inputData);
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validatedData.email);
            expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
            expect(result.message).toBe(successMessage);
            expect(result.token).toBeUndefined();
        });

        it('should throw error when validation fails', async () => {
            // Arrange
            const invalidInput = {
                email: 'invalid-email',
            };

            const validationError = new Error('Formato de email inválido');
            mockValidator.validate.mockImplementation(() => {
                throw validationError;
            });

            // Act & Assert
            await expect(forgotPasswordUseCase.execute(invalidInput)).rejects.toThrow(
                validationError
            );

            expect(mockValidator.validate).toHaveBeenCalledWith(invalidInput);
            expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
            expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
        });

        it('should throw error when repository update fails', async () => {
            // Arrange
            const inputData = {
                email: 'test@example.com',
            };

            const validatedData: ForgotPasswordDto = {
                email: 'test@example.com',
            };

            const user = UserEntity.create({
                email: 'test@example.com',
                password: 'hashedPassword',
                status: 'active',
            });

            const updateError = new Error('Database update failed');

            mockValidator.validate.mockReturnValue(validatedData);
            mockUserRepository.findByEmail.mockResolvedValue(user);
            mockUserRepository.updateUser.mockRejectedValue(updateError);

            // Act & Assert
            await expect(forgotPasswordUseCase.execute(inputData)).rejects.toThrow(updateError);

            expect(mockValidator.validate).toHaveBeenCalledWith(inputData);
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validatedData.email);
            expect(mockUserRepository.updateUser).toHaveBeenCalled();
        });

        it('should set reset token with 60 minutes expiration', async () => {
            // Arrange
            const inputData = {
                email: 'test@example.com',
            };

            const validatedData: ForgotPasswordDto = {
                email: 'test@example.com',
            };

            const user = UserEntity.create({
                email: 'test@example.com',
                password: 'hashedPassword',
                status: 'active',
            });

            mockValidator.validate.mockReturnValue(validatedData);
            mockUserRepository.findByEmail.mockResolvedValue(user);
            mockUserRepository.updateUser.mockResolvedValue(user);

            const beforeExecution = new Date();

            // Act
            await forgotPasswordUseCase.execute(inputData);

            // Assert
            expect(user.reset_password_token).toBeDefined();
            expect(user.reset_password_expires).toBeDefined();

            const expirationTime = user.reset_password_expires!;
            const expectedExpiration = new Date(beforeExecution.getTime() + 60 * 60 * 1000);

            // Allow for small time difference in test execution
            expect(Math.abs(expirationTime.getTime() - expectedExpiration.getTime())).toBeLessThan(
                1000
            );
        });

        it('should handle email normalization', async () => {
            // Arrange
            const inputData = {
                email: '  TEST@EXAMPLE.COM  ',
            };

            const validatedData: ForgotPasswordDto = {
                email: 'test@example.com', // Normalized by DTO
            };

            const user = UserEntity.create({
                email: 'test@example.com',
                password: 'hashedPassword',
                status: 'active',
            });

            mockValidator.validate.mockReturnValue(validatedData);
            mockUserRepository.findByEmail.mockResolvedValue(user);
            mockUserRepository.updateUser.mockResolvedValue(user);

            // Act
            const result = await forgotPasswordUseCase.execute(inputData);

            // Assert
            expect(mockValidator.validate).toHaveBeenCalledWith(inputData);
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
            expect(result.message).toBe(successMessage);
            expect(result.token).toBeDefined();
        });
    });
});
