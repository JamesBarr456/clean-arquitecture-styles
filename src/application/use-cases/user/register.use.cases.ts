import { UserEntity } from "../../../domain/entities/user.entity";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { RegisterUserDto } from "../../dto/register.user.dto";
import { Validation } from "../../validators/validation";


export class RegisterUserUseCase {
  constructor(private readonly userRepository: UserRepository,
    private readonly validator: Validation<RegisterUserDto>
  ) {}

  async execute(input: any): Promise<UserEntity> {
    // ✅ Validamos con Zod antes de tocar dominio
    const validated = this.validator.validate(input);
    // 🔍 Comprobamos si ya existe un usuario con ese email

    // 🧱 Creamos la entidad desde datos limpios
    const newUser = UserEntity.createFromRegister(validated);

    // 💾 Guardamos en la base de datos
    const createdUser = await this.userRepository.create(newUser);

    return createdUser;
  }
}