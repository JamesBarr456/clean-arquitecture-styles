import { EncryptService } from '../../../domain/services/encrypt.service';
import { UserRepository } from '../../../domain';
import { UserUpdate } from '../../dto/users';
import { Validation } from '../../validators/validation';

export class UpdateUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly validator: Validation<UserUpdate>,
        private readonly encryptService: EncryptService
    ) {}

    async execute(id: string, data: UserUpdate) {
        const validated = this.validator.validate(data);
        if (validated.password) {
            validated.password = await this.encryptService.hash(validated.password);
        }
        return await this.userRepository.updateUser(id, validated);
    }
}
