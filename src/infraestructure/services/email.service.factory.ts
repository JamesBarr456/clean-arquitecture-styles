import { EmailService } from '../../domain/services/email.service';
import { NodemailerEmailService } from './nodemailer.email.service';

export class EmailServiceFactory {
    static create(
        host: string,
        port: number,
        user: string,
        password: string,
        fromEmail: string,
        fromName: string,
        appUrl: string
    ): EmailService {
        return new NodemailerEmailService(host, port, user, password, fromEmail, fromName, appUrl);
    }

    static async createTestService(): Promise<EmailService> {
        return await NodemailerEmailService.createTestTransporter();
    }
}
