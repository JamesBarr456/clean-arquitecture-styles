import {
    DeleteUserUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    LoginUserUseCase,
    ChangePasswordUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    RegisterUserUseCase,
} from '../../application/use-cases/user';
import { Request, Response } from 'express';
import {
    UserFilterOptions,
    getAllUsersSchema,
    updateUserSchema,
} from '../../application/dto/users';
import {
    RegisterUserSchema,
    ChangePasswordSchema,
    ForgotPasswordSchema,
    ResetPasswordSchema,
    loginUserSchema,
} from '../../application/dto/auth';

import { BcryptEncryptService } from '../../infraestructure/services/bcrypt.encript.service';
import { JwtTokenService } from '../../infraestructure/services/jwt.token.service';
import {
    MongoUserRepository,
    EmailServiceFactory,
} from '../../infraestructure';
import { ZodAdapter } from '../../application/validators/zod.adapter';
import { envs } from '../../config/envs';

export class UserController {
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
    private readonly getUserByIdUseCase = new GetUserByIdUseCase(this.userRepository);
    private readonly deleteUserUseCase = new DeleteUserUseCase(this.userRepository);

    public getUserById = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const user = await this.getUserByIdUseCase.execute(id);
            res.status(200).json({ message: 'User found', payload: user });
        } catch (error: any) {
            res.status(404).json({ message: 'User not found' });
        }
    };

    public findUsers = async (req: Request, res: Response) => {
        const validator = new ZodAdapter(getAllUsersSchema);
        const validated = validator.validate(req.query);
        if (!validated) {
            res.status(400).json({ error: 'Invalid query parameters' });
        }
        const userFilterOptions: UserFilterOptions = {
            page: validated.page ?? 1,
            sortBy: validated.sortBy ?? 'createdAt',
            order: validated.order ?? 'asc',
            ...validated,
        };
        try {
            const users = await this.userRepository.findAll(userFilterOptions);
            res.status(200).json({ message: 'Users found', payload: users });
        } catch (error: any) {
            res.status(404).json({ message: 'Users not found' });
        }
    };

    public updatePartialUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = req.body;
        const validator = new ZodAdapter(updateUserSchema);
        const updateUser = new UpdateUserUseCase(
            this.userRepository,
            validator,
            this.encryptService
        );
        const updatedUser = await updateUser.execute(id, data);

        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated', payload: updatedUser });
    };

    public deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;

        const deleted = await this.deleteUserUseCase.execute(id);

        if (!deleted) {
            res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted' });
    };

    // Métodos de autenticación transferidos desde AuthController
    public register = async (req: Request, res: Response): Promise<void> => {
        const validator = new ZodAdapter(RegisterUserSchema);
        const registerUser = new RegisterUserUseCase(
            this.userRepository,
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
