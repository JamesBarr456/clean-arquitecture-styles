
import { AuthRepository, UserEntity } from '../../domain';
import { AuthDatasource } from '../../domain/datasources';


export class AuthRepositoryImpl implements AuthRepository { 
    constructor(private readonly datasource: AuthDatasource) {}
    create(user: UserEntity): Promise<UserEntity> {
        return this.datasource.create(user);
    }
}
