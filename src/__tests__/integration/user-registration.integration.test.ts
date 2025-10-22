import { RegisterUserUseCase } from '../../application/use-cases/auth/register.use.cases';
import { ZodAdapter } from '../../application/validators/zod.adapter';
import { RegisterUserSchema } from '../../application/dto/auth/register.auth.dto';
import { BcryptEncryptService } from '../../infraestructure/services/bcrypt.encript.service';
import { MongoAuthRepository } from '../../infraestructure/repositories/mongo.auth.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserModel } from '../../infraestructure/database/mongo/models/user.model';

// Mock dependencies that interact with external services
jest.mock('../../../infraestructure/database/mongo/models/user.model');
jest.mock('bcrypt');

const MockedUserModel = UserModel as jest.Mocked<typeof UserModel>;
const bcrypt = require('bcrypt');

describe('User Registration Integration Tests', () => {
    let registerUserUseCase: RegisterUserUseCase;
    let authRepository: MongoAuthRepository;
    let validator: ZodAdapter<any>;
    let encryptService: BcryptEncryptService;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup real instances (not mocks) for integration testing
        authRepository = new MongoAuthRepository();
        validator = new ZodAdapter(RegisterUserSchema);
        encryptService = new BcryptEncryptService();

        registerUserUseCase = new RegisterUserUseCase(authRepository, validator, encryptService);

        // Mock bcrypt to return predictable values
        bcrypt.hash = jest.fn().mockResolvedValue('$2b$10$hashedPassword');
        bcrypt.compare = jest.fn().mockResolvedValue(true);
    });

    describe('Complete User Registration Flow', () => {
        it('should successfully register a user through the complete flow', async () => {
            // Arrange
            const inputData = {
                email: 'test@example.com',
                password: 'MySecureP@ssw0rd123',
            };

            const mockCreatedDocument = {
                user_id: 'generated-uuid',
                first_name: '',
                last_name: '',
                email: inputData.email,
                password: '$2b$10$hashedPassword',
                dni: '',
                phone: { country_code: '', number: '' },
                avatar: '',
                roles: ['customer'],
                status: 'active',
                created_at: new Date(),
                updated_at: new Date(),
                last_login: null,
            };

            MockedUserModel.create = jest.fn().mockResolvedValue(mockCreatedDocument);

            // Act
            const result = await registerUserUseCase.execute(inputData);

            // Assert
            expect(result).toBeInstanceOf(UserEntity);
            expect(result.email).toBe(inputData.email);
            expect(result.password).toBe('$2b$10$hashedPassword');
            expect(result.roles).toEqual(['customer']);
            expect(result.status).toBe('active');
            expect(result.user_id).toBeDefined();
            expect(result.created_at).toBeInstanceOf(Date);

            // Verify the complete flow
            expect(bcrypt.hash).toHaveBeenCalledWith(inputData.password, 10);
            expect(MockedUserModel.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: inputData.email,
                    password: '$2b$10$hashedPassword',
                    roles: ['customer'],
                    status: 'active',
                })
            );
        });

        it('should fail validation with invalid email', async () => {
            // Arrange
            const invalidInput = {
                email: 'invalid-email-format',
                password: 'MySecureP@ssw0rd123',
            };

            // Act & Assert
            await expect(registerUserUseCase.execute(invalidInput)).rejects.toThrow(
                'Email inválido'
            );

            // Verify that downstream services were not called
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(MockedUserModel.create).not.toHaveBeenCalled();
        });

        it('should fail validation with weak password', async () => {
            // Arrange
            const invalidInput = {
                email: 'test@example.com',
                password: 'weak',
            };

            // Act & Assert
            await expect(registerUserUseCase.execute(invalidInput)).rejects.toThrow(
                /La contraseña debe tener al menos 8 caracteres/
            );

            // Verify that downstream services were not called
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(MockedUserModel.create).not.toHaveBeenCalled();
        });

        it('should handle database errors gracefully', async () => {
            // Arrange
            const validInput = {
                email: 'test@example.com',
                password: 'MySecureP@ssw0rd123',
            };

            const dbError = new Error('Database connection failed');
            MockedUserModel.create = jest.fn().mockRejectedValue(dbError);

            // Act & Assert
            await expect(registerUserUseCase.execute(validInput)).rejects.toThrow(
                'Database connection failed'
            );

            // Verify that validation and hashing were successful
            expect(bcrypt.hash).toHaveBeenCalledWith(validInput.password, 10);
            expect(MockedUserModel.create).toHaveBeenCalled();
        });

        it('should handle encryption service errors', async () => {
            // Arrange
            const validInput = {
                email: 'test@example.com',
                password: 'MySecureP@ssw0rd123',
            };

            const encryptError = new Error('Encryption service failed');
            bcrypt.hash = jest.fn().mockRejectedValue(encryptError);

            // Act & Assert
            await expect(registerUserUseCase.execute(validInput)).rejects.toThrow(
                'Encryption service failed'
            );

            // Verify that validation was successful but database was not called
            expect(bcrypt.hash).toHaveBeenCalledWith(validInput.password, 10);
            expect(MockedUserModel.create).not.toHaveBeenCalled();
        });

        it('should create user with correct default values', async () => {
            // Arrange
            const minimalInput = {
                email: 'minimal@example.com',
                password: 'MinimalP@ssw0rd123',
            };

            const mockCreatedDocument = {
                user_id: 'generated-uuid-2',
                first_name: '',
                last_name: '',
                email: minimalInput.email,
                password: '$2b$10$hashedPassword',
                dni: '',
                phone: { country_code: '', number: '' },
                avatar: '',
                roles: ['customer'],
                status: 'active',
                created_at: new Date(),
                updated_at: new Date(),
                last_login: null,
            };

            MockedUserModel.create = jest.fn().mockResolvedValue(mockCreatedDocument);

            // Act
            const result = await registerUserUseCase.execute(minimalInput);

            // Assert
            expect(result.first_name).toBe('');
            expect(result.last_name).toBe('');
            expect(result.dni).toBe('');
            expect(result.roles).toEqual(['customer']);
            expect(result.status).toBe('active');
            expect(result.phone).toEqual({ country_code: '', number: '' });
            expect(result.avatar).toBe('');
        });

        it('should handle multiple validation errors', async () => {
            // Arrange
            const invalidInput = {
                email: 'not-an-email',
                password: '123', // Too short, no uppercase, no special char
            };

            // Act & Assert
            await expect(registerUserUseCase.execute(invalidInput)).rejects.toThrow();

            // The error should contain multiple validation messages
            try {
                await registerUserUseCase.execute(invalidInput);
            } catch (error: any) {
                expect(error.message).toContain('Email inválido');
                expect(error.message).toContain('La contraseña debe tener al menos 8 caracteres');
            }

            // Verify that no downstream services were called
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(MockedUserModel.create).not.toHaveBeenCalled();
        });

        it('should preserve user data integrity through the complete flow', async () => {
            // Arrange
            const inputData = {
                email: 'integrity.test@example.com',
                password: 'IntegrityTestP@ssw0rd123',
            };

            let capturedUserEntity: any;
            MockedUserModel.create = jest.fn().mockImplementation(userData => {
                capturedUserEntity = userData;
                return Promise.resolve({
                    ...userData,
                    user_id: 'integrity-test-uuid',
                });
            });

            // Act
            await registerUserUseCase.execute(inputData);

            // Assert data integrity through the flow
            expect(capturedUserEntity.email).toBe(inputData.email);
            expect(capturedUserEntity.password).toBe('$2b$10$hashedPassword');
            expect(capturedUserEntity.password).not.toBe(inputData.password); // Ensure password was hashed
            expect(capturedUserEntity.user_id).toBeDefined();
            expect(capturedUserEntity.created_at).toBeInstanceOf(Date);
            expect(capturedUserEntity.updated_at).toBeInstanceOf(Date);
            expect(capturedUserEntity.roles).toEqual(['customer']);
            expect(capturedUserEntity.status).toBe('active');
        });
    });
});
