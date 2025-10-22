import { NextFunction, Request, Response } from 'express';
import { JwtTokenService } from '../../infraestructure/services/jwt.token.service';
import { envs } from '../../config/envs';

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

export class AuthMiddleware {
    private static tokenService = new JwtTokenService(envs.TOKEN_JWT);

    static validateJWT = (req: Request, res: Response, next: NextFunction): void => {
        const authorization = req.header('Authorization');

        if (!authorization) {
            res.status(401).json({ error: 'Token no proporcionado' });
            return;
        }

        if (!authorization.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Token inválido' });
            return;
        }

        const token = authorization.split(' ')[1] || '';

        try {
            const payload = AuthMiddleware.tokenService.verify(token) as {
                id: string;
                email: string;
                roles: string[];
            };

            if (!payload) {
                res.status(401).json({ error: 'Token inválido' });
                return;
            }

            req.user = payload;
            next();
        } catch (error) {
            res.status(401).json({ error: 'Token inválido' });
            return;
        }
    };
}
