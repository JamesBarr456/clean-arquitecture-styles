import 'dotenv/config';

import { get } from 'env-var';

export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    TOKEN_JWT: get('TOKEN_JWT').required().asString(),
    MONGO_URL: get('MONGO_URL').required().asString(),
    MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),
};
