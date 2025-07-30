import { UserEntity } from '../../domain';
import { UserModel } from '../database/mongo/models';
import { UserRepository } from '../../domain/repositories/user.repository';

export class MongoUserRepository extends UserRepository {
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

    async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await UserModel.findOne({ email }).exec();
        if (!user) return null;
        return this.toEntity(user);
    }

    async findById(id: string): Promise<UserEntity | null> {
        const user = await UserModel.findById(id).exec();
        if (!user) return null;
        return this.toEntity(user);
    }

    async findAll(): Promise<UserEntity[] | null> {
        const users = await UserModel.find().exec();
        if (!users) throw new Error('No users found');
        return users.map(user => this.toEntity(user));
    }
}
