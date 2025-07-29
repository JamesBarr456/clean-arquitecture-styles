import { Request, Response } from 'express';

import { BcryptEncryptService } from '../../infraestructure/services/bcrypt.encript.service';
import { JwtTokenService } from '../../infraestructure/services/jwt.token.service';
import { LoginUserUseCase } from '../../application/use-cases/user/login.use.cases';
import { MongoUserRepository } from '../../infraestructure/repositories/mongo.user.repository';
import { RegisterUserSchema } from '../../application/dto/register.user.dto';
import { RegisterUserUseCase } from '../../application/use-cases';
import { ZodAdapter } from '../../application/validators/zod.adapter';
import { envs } from '../../config/envs';
import { loginUserSchema } from '../../application/dto/login.user.dto';

export class UserController {
    public async register(req: Request, res: Response) {
        const validator = new ZodAdapter(RegisterUserSchema);
        const userRepository = new MongoUserRepository();
        const encryptService = new BcryptEncryptService();
        const registerUser = new RegisterUserUseCase(userRepository, validator, encryptService);

        try {
            const result = await registerUser.execute(req.body);
            res.status(201).json({ message: 'Register succesfull', payload: result });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    public async login(req: Request, res: Response) {
        const validator = new ZodAdapter(loginUserSchema);
        const userRepository = new MongoUserRepository();
        const encryptService = new BcryptEncryptService();
        const tokenService = new JwtTokenService(envs.TOKEN_JWT);
        const loginUser = new LoginUserUseCase(
            userRepository,
            validator,
            encryptService,
            tokenService
        );

        try {
            const result = await loginUser.execute(req.body);
            res.status(200).json({ message: 'Login succesfull', payload: result });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
}
