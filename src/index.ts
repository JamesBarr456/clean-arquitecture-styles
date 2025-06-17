import express from 'express';
import { envs } from './config/envs';

const app = express();


app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hola mundo con Express y TypeScript');
});

app.listen(envs.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${envs.PORT}`);
});

