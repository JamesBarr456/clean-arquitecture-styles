import { UserFilterOptions } from "../../application/dto/users";
import { UserEntity } from "../entities";

export abstract class UserDatasource {
  abstract findById(id: string): Promise<UserEntity | null>;
    abstract findByEmail(email: string): Promise<UserEntity | null>;
    abstract findAll(options: UserFilterOptions): Promise<UserEntity[] | null>;
    abstract update(id: string, data: Partial<UserEntity>): Promise<UserEntity | null>;
    abstract delete(id: string): Promise<boolean>;
}