import { AuthController } from '../controllers';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { Router } from 'express';

export class Authroutes {
    static get routes(): Router {
        const router = Router();

        const controller = new AuthController();

        // Rutas públicas
        router.post('/register', controller.register);
        router.post('/login', controller.login);
        router.post('/forgot-password', controller.forgotPassword);
        router.post('/reset-password', controller.resetPassword);

        // Rutas protegidas
        router.put('/change-password', AuthMiddleware.validateJWT, controller.changePassword);

        return router;
    }
}
