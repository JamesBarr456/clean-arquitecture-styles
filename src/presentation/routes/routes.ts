import { Authroutes } from './auth.routes';
import { Router } from 'express';
import { Usersroutes } from './user.routes';

export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        // Definir las rutas
        router.use('/auth', Authroutes.routes);
        router.use('/users', Usersroutes.routes);
        return router;
    }
}
