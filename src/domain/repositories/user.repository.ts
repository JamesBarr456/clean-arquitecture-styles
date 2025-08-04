import { UserEntity } from '../entities';
import { UserFilterOptions } from '../../application/dto/users';

export abstract class UserRepository {
    abstract findById(id: string): Promise<UserEntity | null>;
    abstract findByEmail(email: string): Promise<UserEntity | null>;
    abstract findAll(options: UserFilterOptions): Promise<UserEntity[] | null>;
    abstract updateUser(id: string, data: Partial<UserEntity>): Promise<UserEntity | null>;
    abstract deleteUser(id: string): Promise<boolean>;
}
