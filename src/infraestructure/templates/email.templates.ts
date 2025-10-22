import { EmailTemplate } from '../../domain/services/email.service';

export class EmailTemplates {
    static passwordReset(
        resetToken: string,
        userName: string = 'Usuario',
        appUrl: string
    ): EmailTemplate {
        const resetUrl = `${appUrl}/reset-password?token=${resetToken}`;

        return {
            subject: 'Restablece tu contraseña',
            htmlBody: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Restablece tu contraseña</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background-color: #f9f9f9; }
                        .button { 
                            display: inline-block; 
                            padding: 12px 30px; 
                            background-color: #4CAF50; 
                            color: white; 
                            text-decoration: none; 
                            border-radius: 5px; 
                            margin: 20px 0;
                        }
                        .token-box { 
                            background-color: #e9e9e9; 
                            padding: 15px; 
                            border-radius: 5px; 
                            font-family: monospace; 
                            font-size: 18px; 
                            text-align: center; 
                            margin: 20px 0;
                            border: 2px dashed #ccc;
                        }
                        .footer { color: #666; font-size: 12px; text-align: center; margin-top: 20px; }
                        .warning { color: #e74c3c; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Restablecimiento de Contraseña</h1>
                        </div>
                        <div class="content">
                            <h2>Hola ${userName},</h2>
                            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
                            
                            <p>Puedes restablecer tu contraseña haciendo clic en el siguiente botón:</p>
                            <div style="text-align: center;">
                                <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
                            </div>
                            
                            <p>O usa el siguiente código de verificación:</p>
                            <div class="token-box">
                                ${resetToken}
                            </div>
                            
                            <p class="warning">⚠️ Este enlace y código expiran en 60 minutos por seguridad.</p>
                            
                            <p>Si no solicitaste este restablecimiento, puedes ignorar este email de forma segura.</p>
                            
                            <hr>
                            <p><strong>¿Problemas con el botón?</strong> Copia y pega este enlace en tu navegador:</p>
                            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                        </div>
                        <div class="footer">
                            <p>Este es un email automático, por favor no respondas.</p>
                            <p>Si tienes problemas, contacta con nuestro soporte.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            textBody: `
Hola ${userName},

Recibimos una solicitud para restablecer la contraseña de tu cuenta.

Código de verificación: ${resetToken}

O usa este enlace: ${resetUrl}

⚠️ Este código expira en 60 minutos por seguridad.

Si no solicitaste este restablecimiento, puedes ignorar este email.

---
Este es un email automático, por favor no respondas.
            `.trim(),
        };
    }

    static passwordChanged(userName: string = 'Usuario'): EmailTemplate {
        return {
            subject: 'Tu contraseña ha sido cambiada',
            htmlBody: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Contraseña cambiada</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background-color: #f9f9f9; }
                        .success { color: #4CAF50; font-weight: bold; }
                        .footer { color: #666; font-size: 12px; text-align: center; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Contraseña Actualizada</h1>
                        </div>
                        <div class="content">
                            <h2>Hola ${userName},</h2>
                            <p class="success">✅ Tu contraseña ha sido cambiada exitosamente.</p>
                            
                            <p>Tu contraseña fue actualizada el ${new Date().toLocaleDateString(
                                'es-ES',
                                {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }
                            )}.</p>
                            
                            <p>Si no realizaste este cambio, por favor contacta inmediatamente con nuestro soporte.</p>
                        </div>
                        <div class="footer">
                            <p>Este es un email automático, por favor no respondas.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            textBody: `
Hola ${userName},

✅ Tu contraseña ha sido cambiada exitosamente.

Fecha: ${new Date().toLocaleDateString('es-ES')}

Si no realizaste este cambio, contacta inmediatamente con soporte.

---
Este es un email automático, por favor no respondas.
            `.trim(),
        };
    }
}
