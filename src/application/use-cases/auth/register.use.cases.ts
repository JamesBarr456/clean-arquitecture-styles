import { AuthRepository } from '../../../domain';
import { EncryptService } from '../../../domain/services/encrypt.service';
import { RegisterUserDto } from '../../dto/auth/register.auth.dto';
import { UserEntity } from '../../../domain/entities/user.entity';
import { Validation } from '../../validators/validation';

export class RegisterUserUseCase {
    constructor(
        private readonly authRepository: AuthRepository,
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
        const createdUser = await this.authRepository.create(newUser);
        return createdUser;
    }
}
