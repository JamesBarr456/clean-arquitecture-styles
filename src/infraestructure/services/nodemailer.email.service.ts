import nodemailer from 'nodemailer';
import { EmailService } from '../../domain/services/email.service';
import { EmailTemplates } from '../templates/email.templates';

export class NodemailerEmailService implements EmailService {
    private transporter: nodemailer.Transporter;

    constructor(
        private readonly host: string,
        private readonly port: number,
        private readonly user: string,
        private readonly password: string,
        private readonly fromEmail: string,
        private readonly fromName: string,
        private readonly appUrl: string
    ) {
        this.transporter = nodemailer.createTransport({
            host: this.host,
            port: this.port,
            secure: this.port === 465, // true para 465, false para otros puertos
            auth: {
                user: this.user,
                pass: this.password,
            },
            tls: {
                rejectUnauthorized: false, // Para desarrollo
            },
        });
    }

    async sendPasswordResetEmail(to: string, resetToken: string, userName?: string): Promise<void> {
        const template = EmailTemplates.passwordReset(
            resetToken,
            userName || 'Usuario',
            this.appUrl
        );

        const mailOptions = {
            from: `"${this.fromName}" <${this.fromEmail}>`,
            to: to,
            subject: template.subject,
            text: template.textBody,
            html: template.htmlBody,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('✅ Email de recuperación enviado:', info.messageId);

            // En desarrollo, mostrar la URL del preview
            if (nodemailer.getTestMessageUrl(info)) {
                console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
            }
        } catch (error) {
            console.error('❌ Error enviando email de recuperación:', error);
            throw new Error('Error enviando email de recuperación');
        }
    }

    async sendPasswordChangedNotification(to: string, userName: string): Promise<void> {
        const template = EmailTemplates.passwordChanged(userName);

        const mailOptions = {
            from: `"${this.fromName}" <${this.fromEmail}>`,
            to: to,
            subject: template.subject,
            text: template.textBody,
            html: template.htmlBody,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('✅ Email de notificación enviado:', info.messageId);

            if (nodemailer.getTestMessageUrl(info)) {
                console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
            }
        } catch (error) {
            console.error('❌ Error enviando email de notificación:', error);
            // No lanzar error aquí porque es solo notificación
        }
    }

    async sendWelcomeEmail(to: string, userName: string): Promise<void> {
        // Implementación futura para email de bienvenida
        const mailOptions = {
            from: `"${this.fromName}" <${this.fromEmail}>`,
            to: to,
            subject: '¡Bienvenido!',
            text: `Hola ${userName}, ¡Bienvenido a nuestra aplicación!`,
            html: `<h1>¡Hola ${userName}!</h1><p>¡Bienvenido a nuestra aplicación!</p>`,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('✅ Email de bienvenida enviado:', info.messageId);
        } catch (error) {
            console.error('❌ Error enviando email de bienvenida:', error);
            // No lanzar error porque es solo notificación
        }
    }

    // Método para testing de la conexión
    async testConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            console.log('✅ Conexión SMTP verificada correctamente');
            return true;
        } catch (error) {
            console.error('❌ Error en conexión SMTP:', error);
            return false;
        }
    }

    // Para desarrollo: crear transporter de testing con Ethereal
    static async createTestTransporter(): Promise<NodemailerEmailService> {
        const testAccount = await nodemailer.createTestAccount();

        return new NodemailerEmailService(
            'smtp.ethereal.email',
            587,
            testAccount.user,
            testAccount.pass,
            'test@example.com',
            'Test App',
            'http://localhost:3000'
        );
    }
}
