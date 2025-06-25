import { UserEntity } from "../../../domain/entities/user.entity";
import { UserRepository } from "../../../domain/repositories/user.repository";


export class RegisterUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: any): Promise<UserEntity> {
    // ✅ Validamos con Zod antes de tocar dominio

    // 🔍 Comprobamos si ya existe un usuario con ese email

    // 🧱 Creamos la entidad desde datos limpios
    const newUser = UserEntity.createFromRegister(input);

    // 💾 Guardamos en la base de datos
    const createdUser = await this.userRepository.create(newUser);

    return createdUser;
  }
}