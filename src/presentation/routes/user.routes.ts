import { Router } from 'express';
import { UserController } from '../controllers';

export class Usersroutes {
    static get routes(): Router {
        const router = Router();

        const controller = new UserController();

        // Definir las rutas
        router.get('/:id', controller.getUserById); // /users/64fbd92a12...
        router.get('/', controller.findUsers); // /users?email=emma@mail.com
        router.patch('/:id', controller.updatePartialUser); // Solo modifica un campo
        router.delete('/:id', controller.deleteUser); // Elimina usuario
        // Puedes agregar más rutas aquí según sea necesario
        return router;
    }
}
