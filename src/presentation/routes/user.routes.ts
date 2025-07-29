import { AuthController } from '../controllers/auth.controller';
import { Router } from 'express';

export class Authroutes {
    static get routes(): Router {
        const router = Router();

        const controller = new AuthController();

        // Definir las rutas
        router.post('/register', controller.register);
        router.post('/login', controller.login);
        // Puedes agregar más rutas aquí según sea necesario
        return router;
    }
}
