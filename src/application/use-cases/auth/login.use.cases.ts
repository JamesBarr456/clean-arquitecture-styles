import { EncryptService } from '../../../domain/services/encrypt.service';

import { TokenService } from '../../../domain/services/token.service';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { GetUserByEmail } from '../users';



export interface LoginUserUseCase {
    execute(input: { email: string, password: string}): Promise<{ user: UserEntity; token: string }>;
}
export class LoginUser implements LoginUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly encryptService: EncryptService,
        private readonly tokenService: TokenService
    ) {}

    async execute(input:{ email: string, password: string} ): Promise<{ user: UserEntity; token: string }> {
      
        const validateUser = await new GetUserByEmail(this.userRepository).execute(input.email);
        if (!validateUser) {
            throw new Error('Email not found');
        }
        const comparePassword = await this.encryptService.compare(
            input.password,
            validateUser.password
        );

        if (!comparePassword) {
            throw new Error('Invalid password');
        }
        const token = this.tokenService.sign({
            id: validateUser.id,
            email: validateUser.email,
            status: validateUser.status,
        });
        return { user: validateUser, token };
    }
}
