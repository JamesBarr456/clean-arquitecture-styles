
import { Request, Response } from 'express';

import { BcryptEncryptService } from '../../infraestructure/services/bcrypt.encript.service';
import { JwtTokenService } from '../../infraestructure/services/jwt.token.service';
import { LoginUser, RegisterUser } from '../../application/use-cases/auth';
import { RegisterUserSchema } from '../../application/dto/auth';
import { ZodAdapter } from '../../application/validators/zod.adapter';
import { loginUserSchema } from '../../application/dto/auth';
import { AuthRepositoryImpl, UserRepositoryImpl } from '../../infraestructure';
import { CustomError } from '../../domain';

export class AuthController {
    constructor(
        private readonly authRepository: AuthRepositoryImpl,
        private readonly userRepository: UserRepositoryImpl,
        private readonly encryptService: BcryptEncryptService,
        private readonly tokenService: JwtTokenService
    ) {}
    public register = async (req: Request, res: Response) => {
       
        try {
            const validator = new ZodAdapter(RegisterUserSchema);
            const validated = validator.validate(req.body);
        
            const result = await new RegisterUser(this.authRepository,this.encryptService ).execute(validated);
            res.status(201).json({ message: 'Register successful', payload: result });
        } catch (error: any) {
             const customError = error instanceof CustomError
                            ? error
                            : CustomError.internalServer(error.message);
                        res.status(customError.statusCode).json({
                            message: customError.message,
                            error: error.message,
                        });
        }
    };

    public login = async (req: Request, res: Response) => {
       
        try {
            const validator = new ZodAdapter(loginUserSchema);
            const validated = validator.validate(req.body);

            const result = await new LoginUser(this.userRepository, this.encryptService, this.tokenService).execute(validated);
            res.status(200).json({ message: 'Login successful', payload: result });
        } catch (error: any) {
            const customError = error instanceof CustomError
                            ? error
                            : CustomError.internalServer(error.message);
                        res.status(customError.statusCode).json({
                            message: customError.message,
                            error: error.message,
                        });
        }
    };
}
