import {
    DeleteUserUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
} from '../../application/use-cases/users';
import { Request, Response } from 'express';
import {
    UserFilterOptions,
    getAllUsersSchema,
    updateUserSchema,
} from '../../application/dto/users';

import { BcryptEncryptService } from '../../infraestructure/services/bcrypt.encript.service';
import { MongoUserRepository } from '../../infraestructure';
import { ZodAdapter } from '../../application/validators/zod.adapter';

export class UserController {
    private readonly userRepository = new MongoUserRepository();
    private readonly encryptService = new BcryptEncryptService();
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
}
