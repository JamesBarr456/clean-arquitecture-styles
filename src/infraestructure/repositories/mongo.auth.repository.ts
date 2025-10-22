import { UserRole, UserStatus } from '../../domain/types/user.type';

import { AuthRepository } from '../../domain/repositories/auth.repository';
import { UserEntity } from '../../domain';
import { UserModel } from '../database/mongo/models';

export class MongoAuthRepository extends AuthRepository {
    async create(user: UserEntity): Promise<UserEntity> {
        const created = await UserModel.create({
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
            dni: user.dni,
            phone: user.phone,
            avatar: user.avatar,
            roles: user.roles,
            status: user.status,
            created_at: user.created_at,
            updated_at: user.updated_at,
            last_login: user.last_login,
        });

        // Convertir documento de MongoDB a UserEntity
        return new UserEntity(
            created.first_name,
            created.last_name,
            created.email,
            created.password,
            created.roles as UserRole[],
            created.status as UserStatus,
            created.user_id,
            created.dni,
            created.phone || { number: '', country_code: '' },
            created.avatar,
            created.created_at,
            created.updated_at,
            created.last_login
        );
    }
}
