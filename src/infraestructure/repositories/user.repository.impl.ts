import { UserFilterOptions } from "../../application/dto/users";
import { UserEntity, UserRepository } from "../../domain";
import { UserDatasource } from "../../domain/datasources";

export class UserRepositoryImpl implements UserRepository {
    constructor(private readonly datasource: UserDatasource) {}

    findByEmail(email: string): Promise<UserEntity | null> {
        return this.datasource.findByEmail(email);
    }
    findById(id: string): Promise<UserEntity | null> {
        return this.datasource.findById(id);
    }

    findAll(options: UserFilterOptions): Promise<UserEntity[] | null> {
        return this.datasource.findAll(options);
    }

    update(id: string, user: Partial<UserEntity>): Promise<UserEntity | null> {
        return this.datasource.update(id, user);
    }

    delete(id: string): Promise<boolean> {
        return this.datasource.delete(id);
    }
}