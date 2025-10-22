import { MongoAuthRepository, MongoUserRepository } from '../../infraestructure';
import { Request, Response } from 'express';

import { BcryptEncryptService } from '../../infraestructure/services/bcrypt.encript.service';
import { JwtTokenService } from '../../infraestructure/services/jwt.token.service';
import { LoginUserUseCase, ChangePasswordUseCase } from '../../application/use-cases/auth';
import { RegisterUserSchema, ChangePasswordSchema } from '../../application/dto/auth';
import { RegisterUserUseCase } from '../../application/use-cases';
import { ZodAdapter } from '../../application/validators/zod.adapter';
import { envs } from '../../config/envs';
import { loginUserSchema } from '../../application/dto/auth';

export class AuthController {
    private readonly authRepository = new MongoAuthRepository();
    private readonly userRepository = new MongoUserRepository();
    private readonly encryptService = new BcryptEncryptService();
    private readonly tokenService = new JwtTokenService(envs.TOKEN_JWT);

    public register = async (req: Request, res: Response): Promise<void> => {
        const validator = new ZodAdapter(RegisterUserSchema);
        const registerUser = new RegisterUserUseCase(
            this.authRepository,
            validator,
            this.encryptService
        );

        try {
            const result = await registerUser.execute(req.body);
            res.status(201).json({ message: 'Register successful', payload: result });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    };

    public login = async (req: Request, res: Response): Promise<void> => {
        const validator = new ZodAdapter(loginUserSchema);
        const loginUser = new LoginUserUseCase(
            this.userRepository,
            validator,
            this.encryptService,
            this.tokenService
        );

        try {
            const result = await loginUser.execute(req.body);
            res.status(200).json({ message: 'Login successful', payload: result });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    };

    public changePassword = async (req: Request, res: Response): Promise<void> => {
        const validator = new ZodAdapter(ChangePasswordSchema);
        const changePassword = new ChangePasswordUseCase(
            this.userRepository,
            validator,
            this.encryptService
        );

        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ error: 'Usuario no autenticado' });
                return;
            }

            const result = await changePassword.execute(req.body, userId);
            res.status(200).json({ message: result.message });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    };
}
