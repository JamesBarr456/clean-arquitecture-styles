import { Router } from 'express';
import { UserController } from '../controllers';
import { UserMiddleware } from '../middlewares/user.middleware';
import { Customerroutes } from './customer.routes';

export class Userroutes {
    static get routes(): Router {
        const router = Router();

        const controller = new UserController();

       // Rutas básicas de usuario
        router.post('/register', controller.register);
        router.post('/login', controller.login);
        router.post('/forgot-password', controller.forgotPassword);
        router.post('/reset-password', controller.resetPassword);
        router.put('/change-password', UserMiddleware.validateJWT, controller.changePassword);
       
         // Rutas generales de usuario
        router.get('/:id', controller.getUserById); 
        router.get('/', controller.findUsers);
        router.patch('/:id', controller.updatePartialUser); 
        router.delete('/:id', controller.deleteUser); 

        // Rutas específicas por rol
        router.use('/customer-data',
                    UserMiddleware.validateJWT, 
                    UserMiddleware.checkRole('customer'), 
                    Customerroutes.routes
        );

        return router;
    }
}
