import { AuthRepository } from '../../../domain';
import { EncryptService } from '../../../domain/services/encrypt.service';
import { RegisterUserDto } from '../../dto/auth/register.auth.dto';
import { UserEntity } from '../../../domain/entities/user.entity';


export interface RegisterUserUseCase {
    execute(input: RegisterUserDto): Promise<UserEntity>;
}
export class RegisterUser implements RegisterUserUseCase {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly encryptService: EncryptService
    ) {}

    async execute(input: RegisterUserDto): Promise<UserEntity> {

        const hashedPassword = await this.encryptService.hash(input.password);
        const newUser = UserEntity.createFromRegister({
            ...input,
            password: hashedPassword,
        });
        const createdUser = await this.authRepository.create(newUser);
        return createdUser;
    }
}
