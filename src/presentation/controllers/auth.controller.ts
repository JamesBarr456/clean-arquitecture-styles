import {
    MongoAuthRepository,
    MongoUserRepository,
    EmailServiceFactory,
} from '../../infraestructure';
import { Request, Response } from 'express';

import { BcryptEncryptService } from '../../infraestructure/services/bcrypt.encript.service';
import { JwtTokenService } from '../../infraestructure/services/jwt.token.service';
import {
    LoginUserUseCase,
    ChangePasswordUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
} from '../../application/use-cases/auth';
import {
    RegisterUserSchema,
    ChangePasswordSchema,
    ForgotPasswordSchema,
    ResetPasswordSchema,
} from '../../application/dto/auth';
import { RegisterUserUseCase } from '../../application/use-cases';
import { ZodAdapter } from '../../application/validators/zod.adapter';
import { envs } from '../../config/envs';
import { loginUserSchema } from '../../application/dto/auth';

export class AuthController {
    private readonly authRepository = new MongoAuthRepository();
    private readonly userRepository = new MongoUserRepository();
    private readonly encryptService = new BcryptEncryptService();
    private readonly tokenService = new JwtTokenService(envs.TOKEN_JWT);
    private readonly emailService = EmailServiceFactory.create(
        envs.EMAIL_HOST,
        envs.EMAIL_PORT,
        envs.EMAIL_USER || '',
        envs.EMAIL_PASSWORD || '',
        envs.EMAIL_FROM,
        envs.EMAIL_FROM_NAME,
        envs.APP_URL
    );

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

    public forgotPassword = async (req: Request, res: Response): Promise<void> => {
        const validator = new ZodAdapter(ForgotPasswordSchema);
        const forgotPassword = new ForgotPasswordUseCase(
            this.userRepository,
            validator,
            this.emailService
        );

        try {
            const result = await forgotPassword.execute(req.body);
            res.status(200).json({
                message: result.message,
                // Solo incluir token en desarrollo/testing
                ...(envs.NODE_ENV !== 'production' && result.token && { token: result.token }),
            });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    };

    public resetPassword = async (req: Request, res: Response): Promise<void> => {
        const validator = new ZodAdapter(ResetPasswordSchema);
        const resetPassword = new ResetPasswordUseCase(
            this.userRepository,
            this.encryptService,
            validator,
            this.emailService
        );

        try {
            const result = await resetPassword.execute(req.body);
            res.status(200).json({
                message: result.message,
            });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    };
}
