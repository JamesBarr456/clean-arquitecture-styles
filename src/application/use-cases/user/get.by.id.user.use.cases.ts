import { UserEntity, UserRepository } from '../../../domain';

export class GetUserByIdUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(id: string): Promise<UserEntity | null> {
        if (!id) {
            throw new Error('User ID is required');
        }

        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        return user;
    }
}
