import { BcryptEncryptService } from '../bcrypt.encript.service';
import bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('BcryptEncryptService', () => {
    let encryptService: BcryptEncryptService;

    beforeEach(() => {
        jest.clearAllMocks();
        encryptService = new BcryptEncryptService();
    });

    describe('hash', () => {
        it('should hash a plain text password', async () => {
            // Arrange
            const plainPassword = 'myPlainPassword123';
            const hashedPassword = '$2b$10$hashedPasswordExample';

            mockedBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);

            // Act
            const result = await encryptService.hash(plainPassword);

            // Assert
            expect(mockedBcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
            expect(result).toBe(hashedPassword);
        });

        it('should use salt rounds of 10', async () => {
            // Arrange
            const plainPassword = 'testPassword';
            const hashedPassword = '$2b$10$hashedPasswordExample';

            mockedBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);

            // Act
            await encryptService.hash(plainPassword);

            // Assert
            expect(mockedBcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
        });

        it('should handle empty string', async () => {
            // Arrange
            const plainPassword = '';
            const hashedPassword = '$2b$10$emptyHashExample';

            mockedBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);

            // Act
            const result = await encryptService.hash(plainPassword);

            // Assert
            expect(mockedBcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
            expect(result).toBe(hashedPassword);
        });

        it('should throw error when bcrypt.hash fails', async () => {
            // Arrange
            const plainPassword = 'testPassword';
            const bcryptError = new Error('Bcrypt hashing failed');

            mockedBcrypt.hash = jest.fn().mockRejectedValue(bcryptError);

            // Act & Assert
            await expect(encryptService.hash(plainPassword)).rejects.toThrow(bcryptError);

            expect(mockedBcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
        });

        it('should handle special characters in password', async () => {
            // Arrange
            const plainPassword = 'P@ssw0rd!#$%^&*()';
            const hashedPassword = '$2b$10$specialCharsHashExample';

            mockedBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);

            // Act
            const result = await encryptService.hash(plainPassword);

            // Assert
            expect(mockedBcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
            expect(result).toBe(hashedPassword);
        });
    });

    describe('compare', () => {
        it('should return true when passwords match', async () => {
            // Arrange
            const plainPassword = 'myPassword123';
            const hashedPassword = '$2b$10$hashedPasswordExample';

            mockedBcrypt.compare = jest.fn().mockResolvedValue(true);

            // Act
            const result = await encryptService.compare(plainPassword, hashedPassword);

            // Assert
            expect(mockedBcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
            expect(result).toBe(true);
        });

        it('should return false when passwords do not match', async () => {
            // Arrange
            const plainPassword = 'wrongPassword';
            const hashedPassword = '$2b$10$hashedPasswordExample';

            mockedBcrypt.compare = jest.fn().mockResolvedValue(false);

            // Act
            const result = await encryptService.compare(plainPassword, hashedPassword);

            // Assert
            expect(mockedBcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
            expect(result).toBe(false);
        });

        it('should handle empty plain password', async () => {
            // Arrange
            const plainPassword = '';
            const hashedPassword = '$2b$10$hashedPasswordExample';

            mockedBcrypt.compare = jest.fn().mockResolvedValue(false);

            // Act
            const result = await encryptService.compare(plainPassword, hashedPassword);

            // Assert
            expect(mockedBcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
            expect(result).toBe(false);
        });

        it('should handle empty hashed password', async () => {
            // Arrange
            const plainPassword = 'myPassword123';
            const hashedPassword = '';

            mockedBcrypt.compare = jest.fn().mockResolvedValue(false);

            // Act
            const result = await encryptService.compare(plainPassword, hashedPassword);

            // Assert
            expect(mockedBcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
            expect(result).toBe(false);
        });

        it('should throw error when bcrypt.compare fails', async () => {
            // Arrange
            const plainPassword = 'myPassword123';
            const hashedPassword = '$2b$10$hashedPasswordExample';
            const bcryptError = new Error('Bcrypt comparison failed');

            mockedBcrypt.compare = jest.fn().mockRejectedValue(bcryptError);

            // Act & Assert
            await expect(encryptService.compare(plainPassword, hashedPassword)).rejects.toThrow(
                bcryptError
            );

            expect(mockedBcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
        });

        it('should handle special characters in comparison', async () => {
            // Arrange
            const plainPassword = 'P@ssw0rd!#$%^&*()';
            const hashedPassword = '$2b$10$specialCharsHashExample';

            mockedBcrypt.compare = jest.fn().mockResolvedValue(true);

            // Act
            const result = await encryptService.compare(plainPassword, hashedPassword);

            // Assert
            expect(mockedBcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
            expect(result).toBe(true);
        });

        it('should work with actual bcrypt hash format validation', async () => {
            // Arrange
            const plainPassword = 'testPassword123';
            const validHashFormat = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

            mockedBcrypt.compare = jest.fn().mockResolvedValue(true);

            // Act
            const result = await encryptService.compare(plainPassword, validHashFormat);

            // Assert
            expect(mockedBcrypt.compare).toHaveBeenCalledWith(plainPassword, validHashFormat);
            expect(result).toBe(true);
        });
    });
});
