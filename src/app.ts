import { AppRoutes } from './presentation/routes/routes';
import { MongoDatabase } from './infraestructure';
import { Server } from './presentation/server';
import { envs } from './config/envs';

(async () => {
    main();
})();
async function main() {
    await MongoDatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL,
    });

    const server = new Server({
        port: envs.PORT,
        routes: AppRoutes.routes,
    });

    server.start();
}
