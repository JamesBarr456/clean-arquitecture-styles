import { ProductController } from '../controllers';
import { ProductDatasourceImpl } from '../../infraestructure/database/product.datasource.impl';
import { ProductRepositoryImpl } from '../../infraestructure/repositories/product.repository.impl';
import { Router } from 'express';

export class Productsroutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new ProductDatasourceImpl();
        const productRepository = new ProductRepositoryImpl(datasource);
        const productController = new ProductController(productRepository);

        // Definir las rutas
        router.get('/:id', productController.getProductById); // /users/64fbd92a12...
        router.get('/', productController.findProducts); // /users?email=emma@mail.com
        router.patch('/:id', productController.updateProducts); // Solo modifica un campo
        router.delete('/:id', productController.deleteProduct); // Elimina usuario
        // Puedes agregar más rutas aquí según sea necesario
        return router;
    }
}
