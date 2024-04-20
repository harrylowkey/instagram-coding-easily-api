import dotenv from 'dotenv';

dotenv.config();

export const env = {
    APP_PORT: process.env.APP_PORT || 3000,
    BACKEND_URL: process.env.BACKEND_URL,
    ROOT_PATH: process.cwd(),
    FACEBOOK: {
        ACCESS_TOKEN: process.env.FACEBOOK_ACCESS_TOKEN
    },
    INSTAGRAM: {
        ACCOUNT_ID: process.env.INSTAGRAM_ACCOUNT_ID
    },
    AWS: {
        ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        REGION: process.env.AWS_REGION,
        BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME
    },
    OPENAPI_API_KEY: process.env.OPENAPI_API_KEY,
    DISCORD: {
        APP_ID: process.env.DISCORD_APP_ID,
        TOKEN: process.env.DISCORD_TOKEN,
        PUBLIC_KEY: process.env.DISCORD_PUBLIC_KEY,
        GUILD_ID: process.env.DISCORD_GUILD_ID
    }
};
