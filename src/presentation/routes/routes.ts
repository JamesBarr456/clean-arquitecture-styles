
import { Router } from 'express';
import { Usersroutes } from './user.routes';


export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        // Definir las rutas

        router.use('/users', Usersroutes.routes);

        return router;
    }
}
