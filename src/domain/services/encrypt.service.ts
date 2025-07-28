export abstract class EncryptService {
    abstract hash(plain: string): Promise<string>;
    abstract compare(plain: string, hashed: string): Promise<boolean>;
}
