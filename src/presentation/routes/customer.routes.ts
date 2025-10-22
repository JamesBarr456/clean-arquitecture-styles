import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';
import { MongoCustomerRepository } from '../../infraestructure/repositories/mongo.customer.repository';

export class CustomerRoutes {
  static get routes(): Router {
    const router = Router();

    // Implementación real del repository
    const customerRepository = new MongoCustomerRepository();
    const controller = new CustomerController(customerRepository);

    // Rutas específicas de customer
    // Todas estas rutas asumen que hay middleware de autenticación que agrega req.user
    
    // GET /api/users/me/customer-profile - Obtener perfil de customer
    router.get('/profile', controller.getCustomerProfile);
    
    // GET /api/users/me/customer-orders - Obtener órdenes del customer
    router.get('/orders', controller.getCustomerOrders);
    
    // GET /api/users/me/customer-stats - Obtener estadísticas del customer
    router.get('/stats', controller.getCustomerStats);
    
    // PUT /api/users/me/customer-profile - Actualizar perfil de customer
    router.put('/profile', controller.updateCustomerProfile);

    return router;
  }
}