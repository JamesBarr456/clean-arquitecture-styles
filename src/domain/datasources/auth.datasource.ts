import { UserEntity } from '../entities';



export abstract class AuthDatasource {
    abstract create(user: UserEntity): Promise<UserEntity>;
}

