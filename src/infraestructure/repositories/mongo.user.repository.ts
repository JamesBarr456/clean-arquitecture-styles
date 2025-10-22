import { UserEntity } from '../../domain';
import { UserFilterOptions } from '../../application/dto/users';
import { UserModel } from '../database/mongo/models';
import { UserRepository } from '../../domain/repositories';

export class MongoUserRepository extends UserRepository {
    private toEntity(user: any): UserEntity {
        const entity = new UserEntity(
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

        // Agregar campos de reset password si existen
        if (user.reset_password_token) {
            entity.reset_password_token = user.reset_password_token;
        }
        if (user.reset_password_expires) {
            entity.reset_password_expires = user.reset_password_expires;
        }

        return entity;
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await UserModel.findOne({ email }).exec();
        if (!user) return null;
        return this.toEntity(user);
    }

    async findByResetToken(token: string): Promise<UserEntity | null> {
        const user = await UserModel.findOne({
            reset_password_token: token,
            reset_password_expires: { $gt: new Date() },
        }).exec();
        if (!user) return null;
        return this.toEntity(user);
    }

    async findById(id: string): Promise<UserEntity | null> {
        const user = await UserModel.findById(id).exec();
        if (!user) return null;
        return this.toEntity(user);
    }

    async findAll(options: UserFilterOptions): Promise<UserEntity[] | null> {
        const {
            status,
            first_name,
            last_name,
            page = 1,
            sortBy = 'createdAt',
            order = 'asc',
        } = options;
        const filter: Record<string, any> = {};

        if (status) filter.status = status;
        if (first_name) filter.first_name = { $regex: new RegExp(first_name, 'i') };
        if (last_name) filter.last_name = { $regex: new RegExp(last_name, 'i') };

        // Orden dinámico
        const sortOrder = order === 'asc' ? 1 : -1;

        // Paginación
        const limit = 10;
        const skip = (page - 1) * limit;
        const users = await UserModel.find(filter)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .exec();

        if (!users || users.length === 0) throw new Error('No users found');

        return users.map(user => this.toEntity(user));
    }

    async updateUser(id: string, data: Partial<UserEntity>): Promise<UserEntity | null> {
        const updated = await UserModel.findByIdAndUpdate(id, data, { new: true });
        return updated ? this.toEntity(updated) : null;
    }

    async deleteUser(id: string): Promise<boolean> {
        const result = await UserModel.findByIdAndDelete(id);
        return result !== null;
    }
}
