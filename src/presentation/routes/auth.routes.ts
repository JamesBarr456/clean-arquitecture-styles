import { Router } from 'express';
import { UserController } from '../controllers/user.controller';





export class Authroutes {


  static get routes(): Router {

    const router = Router();


    const controller = new UserController();
    
    // Definir las rutas
    router.post('/register', controller.register);
    router.post('/login', controller.login);
    // router.get('/users', controller.);
    // router.get('/users/:id', controller.);
    // router.patch('/users/:id', controller.);
    // router.delete('/users/:id', controller.);
    // router.get('/users/search', controller.);
    return router;
  }


}