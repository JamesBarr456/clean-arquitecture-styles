import { UserEntity, UserRepository } from '../../../domain';

export class GetAllUserByIdUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(): Promise<UserEntity[] | null> {
        const users = await this.userRepository.findAll();

        if (!users) {
            throw new Error(`Users not founds`);
        }
        return users;
    }
}
