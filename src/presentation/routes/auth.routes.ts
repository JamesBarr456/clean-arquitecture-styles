import { envs } from '../../config/envs';
import { AuthRepositoryImpl, UserRepositoryImpl } from '../../infraestructure';
import { AuthDatasourceImpl, UserDatasourceImpl } from '../../infraestructure/database';
import { BcryptEncryptService } from '../../infraestructure/services/bcrypt.encript.service';
import { JwtTokenService } from '../../infraestructure/services/jwt.token.service';
import { AuthController } from '../controllers';
import { Router } from 'express';

export class Authroutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new AuthDatasourceImpl();
        const datasourceUser = new UserDatasourceImpl();
        const authRepository = new AuthRepositoryImpl(datasource);
        const userRepository = new UserRepositoryImpl(datasourceUser);
        const encryptService = new BcryptEncryptService()
        const tokenService = new JwtTokenService(envs.TOKEN_JWT)
        const controller = new AuthController(authRepository, userRepository, encryptService, tokenService);

        // Definir las rutas
        router.post('/register', controller.register);
        router.post('/login', controller.login);
        // Puedes agregar más rutas aquí según sea necesario
        return router;
    }
}
