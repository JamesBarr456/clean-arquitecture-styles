import { UserRepository } from '../../../domain';

export class DeleteUserUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(id: string) {
        return await this.userRepository.deleteUser(id);
    }
}
