import { Router } from "express";

export class AppRoutes {


    static get routes(): Router {
  
      const router = Router();
      
      // Definir las rutas
     router.use('/', (_req, res) => {
        res.send('Hola mundo con Express y TypeScript')})
  
  
  
      return router;
    }
  
  
  }