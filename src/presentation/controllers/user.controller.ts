import {
    DeleteUser,
    GetUser,
    GetAllUser,
    UpdateUser
} from '../../application/use-cases/users';
import { Request, Response } from 'express';
import {
    UserFilterOptions,
    getAllUsersSchema,
    updateUserSchema,
} from '../../application/dto/users';

import { BcryptEncryptService } from '../../infraestructure/services/bcrypt.encript.service';
import { ZodAdapter } from '../../application/validators/zod.adapter';
import { UserRepositoryImpl } from '../../infraestructure';
import { CustomError } from '../../domain';

export class UserController {
   constructor(
        private readonly userRepository: UserRepositoryImpl,
        private readonly encryptService: BcryptEncryptService
    ) {}

    public getUserById = (req: Request, res: Response) => {
        
        try {
            const { id } = req.params;
            const user = new GetUser(this.userRepository).execute(id);
            res.status(200).json({ message: 'User found', payload: user });
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

    public findUsers =  (req: Request, res: Response) => {
       
        try {
            const validator = new ZodAdapter(getAllUsersSchema);
            const validated = validator.validate(req.query);
            if (!validated) {
                const customError = CustomError.badRequest('Invalid query parameters');
                res.status(customError.statusCode).json({
                    message: customError.message,
                });
            }
            const userFilterOptions: UserFilterOptions = {
                page: validated.page ?? 1,
                sortBy: validated.sortBy ?? 'createdAt',
                order: validated.order ?? 'asc',
                ...validated,
            };
            const users = new GetAllUser(this.userRepository).execute(userFilterOptions);
            res.status(200).json({ message: 'Users found', payload: users });
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

    public updateUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const validator = new ZodAdapter(updateUserSchema);
            const validated = validator.validate(data);

            if (!validated) {
                const customError = CustomError.badRequest('Invalid data');
                res.status(customError.statusCode).json({
                    message: customError.message,
                });
            }

            const updatedUser = await new UpdateUser(this.userRepository, this.encryptService).execute(id, validated);
            res.status(200).json({ message: 'User updated', payload: updatedUser });
    }   catch (error: any) {
             const customError = error instanceof CustomError
                ? error
                : CustomError.internalServer(error.message);
            res.status(customError.statusCode).json({
                message: customError.message,
                error: error.message,
            });
        }
}

    public deleteUser = (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            new DeleteUser(this.userRepository).execute(id);
           
            res.status(200).json({ message: 'User deleted' });
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
