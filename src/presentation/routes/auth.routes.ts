import { AuthController } from '../controllers';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { Router } from 'express';

export class Authroutes {
    static get routes(): Router {
        const router = Router();

        const controller = new AuthController();

        router.post('/register', controller.register);
        router.post('/login', controller.login);

        router.put('/change-password', AuthMiddleware.validateJWT, controller.changePassword);

        return router;
    }
}
