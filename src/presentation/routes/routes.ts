import { Authroutes } from './user.routes';
import { Router } from 'express';

export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        // Definir las rutas
        router.use('/auth', Authroutes.routes);

        return router;
    }
}
