import { Router } from "express";
import { Authroutes } from "./auth.routes";

export class AppRoutes {


    static get routes(): Router {
  
      const router = Router();
      
      // Definir las rutas
    //  router.use('/api/auth', Authroutes.routes)
    router.use('/api/auth', (_req, res) => {
        res.json({ message: "Auth route is not implemented yet." })});
  
  
  
      return router;
    }
  
  
  }