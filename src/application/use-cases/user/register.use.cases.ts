import { EncryptService } from '../../../domain/services/encrypt.service';
import { RegisterUserDto } from '../../dto/register.user.dto';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { Validation } from '../../validators/validation';

export class RegisterUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly validator: Validation<RegisterUserDto>,
        private readonly encryptService: EncryptService
    ) {}

    async execute(input: any): Promise<UserEntity> {
        const validated = this.validator.validate(input);
        const hashedPassword = await this.encryptService.hash(validated.password);
        const newUser = UserEntity.createFromRegister({
            ...validated,
            password: hashedPassword,
        });
        const createdUser = await this.userRepository.create(newUser);
        return createdUser;
    }
}
