import { UserEntity } from '../entities/user.entity';

export abstract class AuthRepository {
    abstract create(user: UserEntity): Promise<UserEntity>;
}
