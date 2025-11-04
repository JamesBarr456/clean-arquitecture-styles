import { UserRepository } from '../../../domain/repositories/user.repository';
import { EmailService } from '../../../domain/services/email.service';
import { EncryptService } from '../../../domain/services/encrypt.service';
import { ResetPasswordDto } from '../../dto/auth/reset.password.dto';
import { Validation } from '../../validators/validation';
import { CustomError } from '../../../domain/errors/custom.error';

export class ResetPasswordUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly encryptService: EncryptService,
        private readonly validator: Validation<ResetPasswordDto>,
        private readonly emailService: EmailService | null = null
    ) {}

    async execute(input: any): Promise<{ message: string }> {
        const validated = this.validator.validate(input);

        // Buscar usuario por token de reset
        const user = await this.userRepository.findByResetToken(validated.token);

        if (!user) {
            throw CustomError.badRequest('Token inválido o expirado');
        }

        // Verificar si el token está vigente
        if (!user.isResetPasswordTokenValid(validated.token)) {
            // Limpiar token expirado
            user.clearResetPasswordToken();
            await this.userRepository.updateUser(user.user_id!, {
                reset_password_token: user.reset_password_token,
                reset_password_expires: user.reset_password_expires,
                updated_at: user.updated_at,
            });
            throw CustomError.badRequest('Token inválido o expirado');
        }

        // Verificar que el usuario esté activo
        if (user.status !== 'active') {
            throw CustomError.badRequest('Usuario inactivo');
        }

        // Verificar que la nueva contraseña no sea igual a la actual
        const isSamePassword = await this.encryptService.compare(
            validated.newPassword,
            user.password
        );
        if (isSamePassword) {
            throw CustomError.badRequest('La nueva contraseña debe ser diferente a la actual');
        }

        // Encriptar nueva contraseña
        const hashedPassword = await this.encryptService.hash(validated.newPassword);

        // Actualizar contraseña y limpiar token
        user.updatePassword(hashedPassword);
        user.clearResetPasswordToken();

        await this.userRepository.updateUser(user.user_id!, {
            password: user.password,
            reset_password_token: user.reset_password_token,
            reset_password_expires: user.reset_password_expires,
            updated_at: user.updated_at,
        });

        // Enviar notificación de cambio de contraseña
        if (this.emailService !== null && this.emailService.sendPasswordChangedNotification) {
            try {
                await this.emailService.sendPasswordChangedNotification(
                    user.email,
                    user.first_name
                );
                console.log(`✅ Notificación de cambio de contraseña enviada a: ${user.email}`);
            } catch (error) {
                console.error('❌ Error enviando notificación de cambio de contraseña:', error);
                // No fallar si el email no se envía
            }
        }

        return {
            message: 'Contraseña restablecida exitosamente',
        };
    }
}
