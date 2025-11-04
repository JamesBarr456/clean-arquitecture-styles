
import { Router } from 'express';
import { Userroutes } from './user.routes';
import { Customerroutes } from './customer.routes';


export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        // Definir las rutas

        router.use('/user', Userroutes.routes);
        router.use('/customer', Customerroutes.routes);

        return router;
    }
}
