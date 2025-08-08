import { UserRepository } from '../../../domain';

export interface DeleteUserUseCase {
    execute(id: string): Promise<boolean>;
}
export class DeleteUser implements DeleteUserUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    execute(id: string): Promise<boolean> {
        return this.userRepository.delete(id);
    }
}
