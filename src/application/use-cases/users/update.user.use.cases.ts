import { EncryptService } from '../../../domain/services/encrypt.service';
import { UserRepository } from '../../../domain';
import { UserUpdate } from '../../dto/users';

export interface UpdateUserUseCase {
    execute(id: string, data: UserUpdate): Promise<UserUpdate | null>;
}
export class UpdateUser implements UpdateUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly encryptService: EncryptService
    ) {}

    async execute(id: string, data: UserUpdate) {
        if (data.password) {
        data.password = await this.encryptService.hash(data.password);
        }
        return await this.userRepository.update(id, data);
    }
}
