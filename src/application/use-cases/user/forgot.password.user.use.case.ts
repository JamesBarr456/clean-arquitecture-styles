import { UserRepository } from '../../../domain/repositories/user.repository';
import { EmailService } from '../../../domain/services/email.service';
import { ForgotPasswordDto } from '../../dto/auth/forgot.password.dto';
import { Validation } from '../../validators/validation';
import { randomBytes } from 'crypto';

export class ForgotPasswordUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly validator: Validation<ForgotPasswordDto>,
        private readonly emailService: EmailService | null = null
    ) {}

    async execute(input: any): Promise<{ message: string; token?: string }> {
        const validated = this.validator.validate(input);

        const user = await this.userRepository.findByEmail(validated.email);

        const successMessage =
            'Si el email está registrado, recibirás un enlace para restablecer tu contraseña';

        if (!user) {
            return { message: successMessage };
        }

        if (user.status !== 'active') {
            return { message: successMessage };
        }

        // Generar token de 6 dígitos para mayor seguridad
        const resetToken = randomBytes(3).toString('hex');

        user.setResetPasswordToken(resetToken, 60);

        await this.userRepository.updateUser(user.user_id!, {
            reset_password_token: user.reset_password_token,
            reset_password_expires: user.reset_password_expires,
            updated_at: user.updated_at,
        });

        try {
            // Enviar email con el token de recuperación
            if (this.emailService) {
                await this.emailService.sendPasswordResetEmail(
                    user.email,
                    resetToken,
                    user.first_name
                );
                console.log(`✅ Email de recuperación enviado a: ${user.email}`);
            }
        } catch (error) {
            console.error('❌ Error enviando email de recuperación:', error);
            // No fallar si el email no se envía, pero log el error
        }

        // En desarrollo, incluir el token para testing
        return {
            message: successMessage,
            token: process.env.NODE_ENV !== 'production' ? resetToken : undefined,
        };
    }
}
