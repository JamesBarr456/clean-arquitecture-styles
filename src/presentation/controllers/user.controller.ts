import { Request, Response } from "express";
import { MongoUserRepository } from "../../infraestructure/repositories/mongo.user.repository";
import { RegisterUserUseCase } from "../../domain/use-cases";


export class UserController {
  public async register(req: Request, res: Response) {
    const userRepository = new MongoUserRepository();
    const registerUser = new RegisterUserUseCase(userRepository);

    try {
      const user = await registerUser.execute(req.body);
      res.status(201).json({ message: "User registered", user });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}