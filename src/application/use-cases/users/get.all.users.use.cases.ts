import { UserEntity, UserRepository } from '../../../domain';
import { UserFilterOptions } from '../../dto/users';

export class GetAllUserByIdUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(options: UserFilterOptions): Promise<UserEntity[] | null> {
        const users = await this.userRepository.findAll(options);

        if (!users) {
            throw new Error(`Users not founds`);
        }
        return users;
    }
}
