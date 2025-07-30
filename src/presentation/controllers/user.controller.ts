import { Request, Response } from 'express';

import { GetUserByIdUseCase } from '../../application/use-cases/users';
import { MongoUserRepository } from '../../infraestructure';
import { ZodAdapter } from '../../application/validators/zod.adapter';
import { getAllUsersSchema, UserFilterOptions } from '../../application/dto/users';

export class UserController {
    private readonly userRepository = new MongoUserRepository();
    private readonly getUserByIdUseCase = new GetUserByIdUseCase(this.userRepository);

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
            return res.status(400).json({ error: 'Invalid query parameters' });
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
            res.status(404).json({ message: 'Users not found'});
        }
    };

    // public updatePartialUser = async (req: Request, res: Response) => {
    //     throw new Error('Method not implemented.');
    // };

    // public updateUser = async (req: Request, res: Response) => {
    //     throw new Error('Method not implemented.');
    // };

    // public deleteUser = async (req: Request, res: Response) => {
    //     throw new Error('Method not implemented.');
    // };
}
