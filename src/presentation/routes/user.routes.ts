import { Router } from 'express';
import { UserController } from '../controllers';
import { UserDatasourceImpl } from '../../infraestructure/database';
import { UserRepositoryImpl } from '../../infraestructure';
import { BcryptEncryptService } from '../../infraestructure/services/bcrypt.encript.service';

export class Usersroutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new UserDatasourceImpl();
        const userRepository = new UserRepositoryImpl(datasource);
        const encryptService = new BcryptEncryptService()
        const controller = new UserController(userRepository, encryptService);

        // Definir las rutas
        router.get('/:id', controller.getUserById); // /users/64fbd92a12...
        router.get('/', controller.findUsers); // /users?email=emma@mail.com
        router.patch('/:id', controller.updateUser); // Solo modifica un campo
        router.delete('/:id', controller.deleteUser); // Elimina usuario
        // Puedes agregar más rutas aquí según sea necesario
        return router;
    }
}
