import { Code2ImageModule } from '@harrylowkey/code2image';
import { env } from './env.config';

export const code2ImageConfig = Code2ImageModule.forRoot({
    host: env.BACKEND_URL
});
