import { NextFunction, Request, Response } from 'express';
import { JwtTokenService } from '../../infraestructure/services/jwt.token.service';
import { envs } from '../../config/envs';
import { UserRole } from '../../domain/types/user.type';
import { CustomError } from '../../domain/errors/custom.error';

// Extender la interfaz Request para incluir user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                roles: string[];
            };
        }
    }
}

export class UserMiddleware {
    private static tokenService = new JwtTokenService(envs.TOKEN_JWT);

    static validateJWT = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const authorization = req.header('Authorization');

            if (!authorization) {
                throw CustomError.unauthorized('Token de acceso requerido');
            }

            if (!authorization.startsWith('Bearer ')) {
                throw CustomError.unauthorized('Formato de token inválido. Use: Bearer <token>');
            }

            const token = authorization.split(' ')[1];

            if (!token || token.trim() === '') {
                throw CustomError.unauthorized('Token no proporcionado');
            }

            const payload = UserMiddleware.tokenService.verify(token) as {
                id: string;
                email: string;
                roles: string[];
            };

            if (!payload || !payload.id || !payload.email) {
                throw CustomError.unauthorized('Token inválido o expirado');
            }

            req.user = payload;
            next();
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ 
                    error: error.message,
                    statusCode: error.statusCode 
                });
                return;
            }

            // Error de JWT o cualquier otro error no controlado
            res.status(401).json({ 
                error: 'Token inválido o expirado',
                statusCode: 401 
            });
            return;
        }
    };

    // Middleware genérico para verificar roles
    static checkRole = (requiredRole: UserRole) => {
        return (req: Request, res: Response, next: NextFunction): void => {
            try {
                if (!req.user) {
                    throw CustomError.unauthorized('Usuario no autenticado');
                }

                if (!req.user.roles || !Array.isArray(req.user.roles)) {
                    throw CustomError.forbidden('Información de roles no válida');
                }

                if (!req.user.roles.includes(requiredRole)) {
                    throw CustomError.forbidden(
                        `Acceso denegado. Se requiere el rol '${requiredRole}' para acceder a este recurso`
                    );
                }

                next();
            } catch (error) {
                if (error instanceof CustomError) {
                    res.status(error.statusCode).json({ 
                        error: error.message,
                        statusCode: error.statusCode,
                        requiredRole: requiredRole 
                    });
                    return;
                }

                // Error no controlado
                res.status(500).json({ 
                    error: 'Error interno del servidor',
                    statusCode: 500 
                });
                return;
            }
        };
    };

   
}
