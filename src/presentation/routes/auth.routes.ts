import { Router } from 'express';
import { UserController } from '../controllers/user.controller';





export class Authroutes {


  static get routes(): Router {

    const router = Router();


    const controller = new UserController();
    
    // Definir las rutas
    router.post('/register', controller.register);;

    return router;
  }


}