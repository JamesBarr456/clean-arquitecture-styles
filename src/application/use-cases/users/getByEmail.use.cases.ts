import { UserEntity, UserRepository } from '../../../domain';

export interface GetUserByEmailUseCase {
    execute(email: string): Promise<UserEntity | null>;
}

export class GetUserByEmail implements GetUserByEmailUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(email: string): Promise<UserEntity | null> {
        if (!email) {
            throw new Error('Email is required');
        }

        const user = await this.userRepository.findByEmail(email);

        
        return user ? user : null;
    }
}
