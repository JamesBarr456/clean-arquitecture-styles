
import { Router } from 'express';
import { Userroutes } from './user.routes';



export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        // Definir las rutas

        router.use('/user', Userroutes.routes);
       

        return router;
    }
}
