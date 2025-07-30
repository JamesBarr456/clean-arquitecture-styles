import { Request, Response } from 'express';

import { GetUserByIdUseCase } from '../../application/use-cases/users';
import { MongoUserRepository } from '../../infraestructure';

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

    // public findUsers = async (req: Request, res: Response) => {
    //     throw new Error('Method not implemented.');
    // };

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
