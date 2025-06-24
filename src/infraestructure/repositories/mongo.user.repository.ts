import { UserEntity } from "../../domain";
import { UserRepository } from "../../domain/repositories/user.repository";
import { UserModel } from "../database/mongo/models";

export class MongoUserRepository extends UserRepository {
    async create(user: UserEntity): Promise<UserEntity> {
      const created = await UserModel.create({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password,
        avatar: user.avatar,
        created_at: user.created_at,
        updated_at: user.updated_at
      });
  
      return new UserEntity(
        created.first_name,
        created.last_name,
        created.email,
        created.password,
        created.dni,
        created.number_phone,
        created.created_at,
        created.updated_at,
        created._id.toString(),
        created.avatar
      )
    }
  }