import { Request, Response } from "express";
import { MongoUserRepository } from "../../infraestructure/repositories/mongo.user.repository";
import { RegisterUserUseCase } from "../../application/use-cases";
import { ZodAdapter } from "../../application/validators/zod.adapter";
import { RegisterUserSchema } from "../../application/dto/register.user.dto";


export class UserController {
  public async register(req: Request, res: Response) {
    const validator = new ZodAdapter(RegisterUserSchema);
    const userRepository = new MongoUserRepository();
    const registerUser = new RegisterUserUseCase(userRepository, validator);

    try {
      const user = await registerUser.execute(req.body);
      res.status(201).json({ message: "User registered", user });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}