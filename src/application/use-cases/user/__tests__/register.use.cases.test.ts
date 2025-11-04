import { RegisterUserUseCase } from '../register.user.use.cases';
import { AuthRepository } from '../../../../domain/repositories/auth.repository';
import { EncryptService } from '../../../../domain/services/encrypt.service';
import { Validation } from '../../../validators/validation';
import { RegisterUserDto } from '../../../dto/auth/register.auth.dto';
import { UserEntity } from '../../../../domain/entities/user.entity';

// Mocks
const mockAuthRepository: jest.Mocked<AuthRepository> = {
    create: jest.fn(),
};

const mockValidator: jest.Mocked<Validation<RegisterUserDto>> = {
    validate: jest.fn(),
};

const mockEncryptService: jest.Mocked<EncryptService> = {
    hash: jest.fn(),
    compare: jest.fn(),
};

describe('RegisterUserUseCase', () => {
    let registerUserUseCase: RegisterUserUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        registerUserUseCase = new RegisterUserUseCase(
            mockAuthRepository,
            mockValidator,
            mockEncryptService
        );
    });

    describe('execute', () => {
        it('should successfully register a new user', async () => {
            // Arrange
            const inputData = {
                email: 'test@example.com',
                password: 'Password123!',
                first_name: 'John',
                last_name: 'Doe',
            };

            const validatedData: RegisterUserDto = {
                email: 'test@example.com',
                password: 'Password123!',
            };

            const hashedPassword = 'hashedPassword123';
            const createdUser = UserEntity.create({
                ...validatedData,
                password: hashedPassword,
                first_name: 'John',
                last_name: 'Doe',
            });

            mockValidator.validate.mockReturnValue(validatedData);
            mockEncryptService.hash.mockResolvedValue(hashedPassword);
            mockAuthRepository.create.mockResolvedValue(createdUser);

            // Act
            const result = await registerUserUseCase.execute(inputData);

            // Assert
            expect(mockValidator.validate).toHaveBeenCalledWith(inputData);
            expect(mockEncryptService.hash).toHaveBeenCalledWith(validatedData.password);
            expect(mockAuthRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: validatedData.email,
                    password: hashedPassword,
                    user_id: expect.any(String),
                    created_at: expect.any(Date),
                    updated_at: expect.any(Date),
                })
            );
            expect(result).toBe(createdUser);
        });

        it('should throw error when validation fails', async () => {
            // Arrange
            const invalidInput = {
                email: 'invalid-email',
                password: '123',
            };

            const validationError = new Error(
                'Email inválido; La contraseña debe tener al menos 8 caracteres.'
            );
            mockValidator.validate.mockImplementation(() => {
                throw validationError;
            });

            // Act & Assert
            await expect(registerUserUseCase.execute(invalidInput)).rejects.toThrow(
                validationError
            );

            expect(mockValidator.validate).toHaveBeenCalledWith(invalidInput);
            expect(mockEncryptService.hash).not.toHaveBeenCalled();
            expect(mockAuthRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error when password hashing fails', async () => {
            // Arrange
            const inputData = {
                email: 'test@example.com',
                password: 'Password123!',
            };

            const validatedData: RegisterUserDto = {
                email: 'test@example.com',
                password: 'Password123!',
            };

            const hashError = new Error('Hashing failed');
            mockValidator.validate.mockReturnValue(validatedData);
            mockEncryptService.hash.mockRejectedValue(hashError);

            // Act & Assert
            await expect(registerUserUseCase.execute(inputData)).rejects.toThrow(hashError);

            expect(mockValidator.validate).toHaveBeenCalledWith(inputData);
            expect(mockEncryptService.hash).toHaveBeenCalledWith(validatedData.password);
            expect(mockAuthRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error when repository create fails', async () => {
            // Arrange
            const inputData = {
                email: 'test@example.com',
                password: 'Password123!',
            };

            const validatedData: RegisterUserDto = {
                email: 'test@example.com',
                password: 'Password123!',
            };

            const hashedPassword = 'hashedPassword123';
            const repositoryError = new Error('Database connection failed');

            mockValidator.validate.mockReturnValue(validatedData);
            mockEncryptService.hash.mockResolvedValue(hashedPassword);
            mockAuthRepository.create.mockRejectedValue(repositoryError);

            // Act & Assert
            await expect(registerUserUseCase.execute(inputData)).rejects.toThrow(repositoryError);

            expect(mockValidator.validate).toHaveBeenCalledWith(inputData);
            expect(mockEncryptService.hash).toHaveBeenCalledWith(validatedData.password);
            expect(mockAuthRepository.create).toHaveBeenCalled();
        });

        it('should create UserEntity with hashed password', async () => {
            // Arrange
            const inputData = {
                email: 'test@example.com',
                password: 'Password123!',
            };

            const validatedData: RegisterUserDto = {
                email: 'test@example.com',
                password: 'Password123!',
            };

            const hashedPassword = 'hashedPassword123';
            const createdUser = UserEntity.create({
                ...validatedData,
                password: hashedPassword,
            });

            mockValidator.validate.mockReturnValue(validatedData);
            mockEncryptService.hash.mockResolvedValue(hashedPassword);
            mockAuthRepository.create.mockResolvedValue(createdUser);

            // Act
            await registerUserUseCase.execute(inputData);

            // Assert
            const createCall = mockAuthRepository.create.mock.calls[0][0];
            expect(createCall.password).toBe(hashedPassword);
            expect(createCall.password).not.toBe(validatedData.password);
        });
    });
});
