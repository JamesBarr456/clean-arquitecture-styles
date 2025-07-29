import { EncryptService } from '../../../domain/services/encrypt.service';
import { LoginUserDto } from '../../dto/login.user.dto';
import { TokenService } from '../../../domain/services/token.service';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { Validation } from '../../validators/validation';

export class LoginUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly validator: Validation<LoginUserDto>,
        private readonly encryptService: EncryptService,
        private readonly tokenService: TokenService
    ) {}

    async execute(input: any): Promise<{ user: UserEntity; token: string }> {
        const validated = this.validator.validate(input);
        const user = await this.userRepository.findByEmail(validated.email);
        if (!user) {
            throw new Error('Email not found');
        }
        const comparePassword = await this.encryptService.compare(
            validated.password,
            user.password
        );
        if (!comparePassword) {
            throw new Error('Invalid password');
        }
        const token = this.tokenService.sign({
            id: user.id,
            email: user.email,
            status: user.status,
        });
        return { user, token };
    }
}
