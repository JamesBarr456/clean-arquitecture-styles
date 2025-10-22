import 'dotenv/config';

import { get } from 'env-var';

export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    TOKEN_JWT: get('TOKEN_JWT').required().asString(),
    MONGO_URL: get('MONGO_URL').required().asString(),
    MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),

    // Email configuration
    EMAIL_HOST: get('EMAIL_HOST').default('smtp.gmail.com').asString(),
    EMAIL_PORT: get('EMAIL_PORT').default(587).asPortNumber(),
    EMAIL_USER: get('EMAIL_USER').asString(),
    EMAIL_PASSWORD: get('EMAIL_PASSWORD').asString(),
    EMAIL_FROM: get('EMAIL_FROM').default('noreply@app.com').asString(),
    EMAIL_FROM_NAME: get('EMAIL_FROM_NAME').default('Mi Aplicación').asString(),

    // App configuration
    APP_URL: get('APP_URL').default('http://localhost:3000').asString(),
    NODE_ENV: get('NODE_ENV').default('development').asString(),
};
