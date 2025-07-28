import bcrypt from 'bcrypt';

export class BcryptEncryptService {
    async hash(plain: string): Promise<string> {
        return bcrypt.hash(plain, 10);
    }

    async compare(plain: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(plain, hashed);
    }
}
