import { UserEntity } from '../../domain';
import { UserFilterOptions } from '../../application/dto/users';
import { UserModel } from '../database/mongo/models';
import { UserRepository } from '../../domain/repositories';

export class MongoUserRepository extends UserRepository {
    private toEntity(user: any): UserEntity {
        const entity = new UserEntity(
            user.first_name, // first_name
            user.last_name, // last_name
            user.email, // email
            user.password, // password
            user.roles || ['customer'], // roles (array)
            user.status || 'active', // status
            user._id.toString(), // user_id
            user.dni, // dni
            user.number_phone || { country_code: '', number: '' }, // phone
            user.avatar, // avatar
            user.created_at, // created_at
            user.updated_at, // updated_at
            user.last_login // last_login
        );

        if (user.reset_password_token) {
            entity.reset_password_token = user.reset_password_token;
        }
        if (user.reset_password_expires) {
            entity.reset_password_expires = user.reset_password_expires;
        }

        return entity;
    }

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
            return this.toEntity(created);
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
