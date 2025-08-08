import { UserEntity, UserRepository } from '../../../domain';
import { UserFilterOptions } from '../../dto/users';
export interface GetAllUserByIdUseCase {
    execute(options: UserFilterOptions): Promise<UserEntity[] | null>;
}
export class GetAllUser implements GetAllUserByIdUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    execute(options: UserFilterOptions): Promise<UserEntity[] | null> {
        const users = this.userRepository.findAll(options);

        if (!users) {
            throw new Error(`Users not founds`);
        }
        return users;
    }
}
