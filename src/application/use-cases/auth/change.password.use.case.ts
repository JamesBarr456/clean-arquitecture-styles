import { UserRepository } from '../../../domain/repositories/user.repository';
import { EncryptService } from '../../../domain/services/encrypt.service';
import { ChangePasswordDto } from '../../dto/auth/change.password.dto';
import { Validation } from '../../validators/validation';
import { CustomError } from '../../../domain/errors/custom.error';

export class ChangePasswordUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly validator: Validation<ChangePasswordDto>,
        private readonly encryptService: EncryptService
    ) {}

    async execute(input: any, userId: string): Promise<{ message: string }> {
        // Validar datos de entrada
        const validated = this.validator.validate(input);

        // Buscar usuario por ID
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw CustomError.notFound('Usuario no encontrado');
        }

        // Verificar contraseña actual
        const isCurrentPasswordValid = await this.encryptService.compare(
            validated.currentPassword,
            user.getPassword()
        );

        if (!isCurrentPasswordValid) {
            throw CustomError.badRequest('Contraseña actual incorrecta');
        }

        // Encriptar nueva contraseña
        const hashedNewPassword = await this.encryptService.hash(validated.newPassword);

        // Actualizar contraseña en el usuario
        user.updatePassword(hashedNewPassword);

        // Guardar cambios
        await this.userRepository.updateUser(userId, {
            password: hashedNewPassword,
            updated_at: user.updated_at,
        });

        return { message: 'Contraseña actualizada exitosamente' };
    }
}
