export interface EmailService {
    sendPasswordResetEmail(to: string, resetToken: string, userName?: string): Promise<void>;
    sendPasswordChangedNotification(to: string, userName: string): Promise<void>;
    sendWelcomeEmail?(to: string, userName: string): Promise<void>;
}

export interface EmailTemplate {
    subject: string;
    htmlBody: string;
    textBody: string;
}
