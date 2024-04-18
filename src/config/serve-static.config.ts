import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

export const serveStaticConfig = ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),
    serveRoot: '/'
});
