import { UserEntity } from '../entities/user.entity';

export abstract class UserRepository {
    abstract findById(id: string): Promise<UserEntity | null>;
    abstract findByEmail(email: string): Promise<UserEntity | null>;
    abstract findAll(): Promise<UserEntity[] | null>;
    // abstract deleteById(id: string): Promise<boolean>;
}
