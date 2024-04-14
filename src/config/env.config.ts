import dotenv from 'dotenv';

dotenv.config();

export const env = {
    BACKEND_URL: process.env.BACKEND_URL,
    ROOT_PATH: process.cwd()
};
