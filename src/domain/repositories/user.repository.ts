import { UserEntity } from '../entities/user.entity';
import { UserFilterOptions } from '../../application/dto/users';

export abstract class UserRepository {
    abstract create(user: UserEntity): Promise<UserEntity>;
    abstract findById(id: string): Promise<UserEntity | null>;
    abstract findByEmail(email: string): Promise<UserEntity | null>;
    abstract findByResetToken(token: string): Promise<UserEntity | null>;
    abstract findAll(options: UserFilterOptions): Promise<UserEntity[] | null>;
    abstract updateUser(id: string, data: Partial<UserEntity>): Promise<UserEntity | null>;
    abstract deleteUser(id: string): Promise<boolean>;
}
