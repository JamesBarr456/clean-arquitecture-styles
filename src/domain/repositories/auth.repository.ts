import { UserEntity } from '../entities';

export abstract class AuthRepository {
    abstract create(user: UserEntity): Promise<UserEntity>;
}
