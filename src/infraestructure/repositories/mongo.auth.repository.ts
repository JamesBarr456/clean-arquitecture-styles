import { AuthRepository } from '../../domain/repositories/auth.repository';
import { UserEntity } from '../../domain';
import { UserModel } from '../database/mongo/models';

export class MongoAuthRepository extends AuthRepository {
    private toEntity(user: any): UserEntity {
        return new UserEntity(
            user.first_name,
            user.last_name,
            user.email,
            user.password,
            user.dni,
            user.number_phone,
            user.created_at,
            user.updated_at,
            user._id.toString(),
            user.avatar,
            user.status
        );
    }
    async create(user: UserEntity): Promise<UserEntity> {
        const created = await UserModel.create({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
            avatar: user.avatar,
            created_at: user.created_at,
            updated_at: user.updated_at,
        });

        return this.toEntity(created);
    }
}
