import { Router } from 'express';
import { UserController } from '../controllers';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class Userroutes {
    static get routes(): Router {
        const router = Router();

        const controller = new UserController();

        // Definir las rutas
        router.post('/register', controller.register);
        router.post('/login', controller.login);
        router.post('/forgot-password', controller.forgotPassword);
        router.post('/reset-password', controller.resetPassword);
        router.put('/change-password', AuthMiddleware.validateJWT, controller.changePassword);
        router.get('/:id', controller.getUserById); 
        router.get('/', controller.findUsers);
        router.patch('/:id', controller.updatePartialUser); 
        router.delete('/:id', controller.deleteUser); 
        return router;
    }
}
