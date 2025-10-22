import { MongoAuthRepository } from '../mongo.auth.repository';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserModel } from '../../database/mongo/models/user.model';
import { UserRole, UserStatus } from '../../../domain/types/user.type';

// Mock del UserModel
jest.mock('../../database/mongo/models/user.model');
const MockedUserModel = UserModel as jest.Mocked<typeof UserModel>;

describe('MongoAuthRepository', () => {
    let repository: MongoAuthRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        repository = new MongoAuthRepository();
    });

    describe('create', () => {
        it('should create a user and return UserEntity', async () => {
            // Arrange
            const userEntity = UserEntity.create({
                email: 'test@example.com',
                password: 'hashedPassword123',
                first_name: 'John',
                last_name: 'Doe',
                dni: '12345678',
                roles: ['customer'] as UserRole[],
                status: 'active' as UserStatus,
            });

            const mockCreatedDocument = {
                user_id: userEntity.user_id,
                first_name: userEntity.first_name,
                last_name: userEntity.last_name,
                email: userEntity.email,
                password: userEntity.password,
                dni: userEntity.dni,
                phone: userEntity.phone,
                avatar: userEntity.avatar,
                roles: userEntity.roles,
                status: userEntity.status,
                created_at: userEntity.created_at,
                updated_at: userEntity.updated_at,
                last_login: userEntity.last_login,
            };

            MockedUserModel.create = jest.fn().mockResolvedValue(mockCreatedDocument);

            // Act
            const result = await repository.create(userEntity);

            // Assert
            expect(MockedUserModel.create).toHaveBeenCalledWith({
                user_id: userEntity.user_id,
                first_name: userEntity.first_name,
                last_name: userEntity.last_name,
                email: userEntity.email,
                password: userEntity.password,
                dni: userEntity.dni,
                phone: userEntity.phone,
                avatar: userEntity.avatar,
                roles: userEntity.roles,
                status: userEntity.status,
                created_at: userEntity.created_at,
                updated_at: userEntity.updated_at,
                last_login: userEntity.last_login,
            });

            expect(result).toBeInstanceOf(UserEntity);
            expect(result.user_id).toBe(userEntity.user_id);
            expect(result.email).toBe(userEntity.email);
            expect(result.first_name).toBe(userEntity.first_name);
            expect(result.last_name).toBe(userEntity.last_name);
            expect(result.roles).toEqual(userEntity.roles);
            expect(result.status).toBe(userEntity.status);
        });

        it('should handle phone field correctly when null', async () => {
            // Arrange
            const userEntity = UserEntity.create({
                email: 'test@example.com',
                password: 'hashedPassword123',
            });

            const mockCreatedDocument = {
                user_id: userEntity.user_id,
                first_name: userEntity.first_name,
                last_name: userEntity.last_name,
                email: userEntity.email,
                password: userEntity.password,
                dni: userEntity.dni,
                phone: null, // Simulando que viene null de MongoDB
                avatar: userEntity.avatar,
                roles: userEntity.roles,
                status: userEntity.status,
                created_at: userEntity.created_at,
                updated_at: userEntity.updated_at,
                last_login: userEntity.last_login,
            };

            MockedUserModel.create = jest.fn().mockResolvedValue(mockCreatedDocument);

            // Act
            const result = await repository.create(userEntity);

            // Assert
            expect(result.phone).toEqual({ number: '', country_code: '' });
        });

        it('should handle phone field correctly when defined', async () => {
            // Arrange
            const userEntity = UserEntity.create({
                email: 'test@example.com',
                password: 'hashedPassword123',
                phone: { number: '123456789', country_code: '+1' },
            });

            const mockCreatedDocument = {
                user_id: userEntity.user_id,
                first_name: userEntity.first_name,
                last_name: userEntity.last_name,
                email: userEntity.email,
                password: userEntity.password,
                dni: userEntity.dni,
                phone: { number: '123456789', country_code: '+1' },
                avatar: userEntity.avatar,
                roles: userEntity.roles,
                status: userEntity.status,
                created_at: userEntity.created_at,
                updated_at: userEntity.updated_at,
                last_login: userEntity.last_login,
            };

            MockedUserModel.create = jest.fn().mockResolvedValue(mockCreatedDocument);

            // Act
            const result = await repository.create(userEntity);

            // Assert
            expect(result.phone).toEqual({ number: '123456789', country_code: '+1' });
        });

        it('should throw error when UserModel.create fails', async () => {
            // Arrange
            const userEntity = UserEntity.create({
                email: 'test@example.com',
                password: 'hashedPassword123',
            });

            const dbError = new Error('Database connection failed');
            MockedUserModel.create = jest.fn().mockRejectedValue(dbError);

            // Act & Assert
            await expect(repository.create(userEntity)).rejects.toThrow(dbError);
            expect(MockedUserModel.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: userEntity.email,
                    password: userEntity.password,
                })
            );
        });

        it('should properly cast roles and status from MongoDB document', async () => {
            // Arrange
            const userEntity = UserEntity.create({
                email: 'test@example.com',
                password: 'hashedPassword123',
                roles: ['admin', 'seller'] as UserRole[],
                status: 'inactive' as UserStatus,
            });

            const mockCreatedDocument = {
                user_id: userEntity.user_id,
                first_name: userEntity.first_name,
                last_name: userEntity.last_name,
                email: userEntity.email,
                password: userEntity.password,
                dni: userEntity.dni,
                phone: userEntity.phone,
                avatar: userEntity.avatar,
                roles: ['admin', 'seller'], // Como string[] desde MongoDB
                status: 'inactive', // Como string desde MongoDB
                created_at: userEntity.created_at,
                updated_at: userEntity.updated_at,
                last_login: userEntity.last_login,
            };

            MockedUserModel.create = jest.fn().mockResolvedValue(mockCreatedDocument);

            // Act
            const result = await repository.create(userEntity);

            // Assert
            expect(result.roles).toEqual(['admin', 'seller']);
            expect(result.status).toBe('inactive');
            expect(Array.isArray(result.roles)).toBe(true);
            expect(typeof result.status).toBe('string');
        });
    });
});
