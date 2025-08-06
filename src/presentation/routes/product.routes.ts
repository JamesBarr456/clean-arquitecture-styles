import { Router } from 'express';
import { ProductController } from '../controllers';
import { MongoProductRepository } from '../../infraestructure/repositories/mongo.product.repository';


export class Productsroutes {
    static get routes(): Router {
        const router = Router();
        // const datasource = new MongoProductRepository()
        const controller = new ProductController();

        // Definir las rutas
        router.get('/:id', controller.getProductById); // /users/64fbd92a12...
        router.get('/', controller.findProducts); // /users?email=emma@mail.com
        router.patch('/:id', controller.updateProducts); // Solo modifica un campo
        router.delete('/:id', controller.deleteProduct); // Elimina usuario
        // Puedes agregar más rutas aquí según sea necesario
        return router;
    }
}
