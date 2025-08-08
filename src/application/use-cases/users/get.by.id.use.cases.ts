import { UserEntity, UserRepository } from '../../../domain';

export interface GetUserByIdUseCase {
    execute(id: string): Promise<UserEntity | null>;
}

export class GetUser implements GetUserByIdUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    execute(id: string): Promise<UserEntity | null> {
        if (!id) {
            throw new Error('User ID is required');
        }

        const user = this.userRepository.findById(id);

        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        return user;
    }
}
