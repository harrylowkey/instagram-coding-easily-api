import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from '~posts/post.module';
import { serveStaticConfig } from '~config/serve-static.config';

@Module({
    imports: [serveStaticConfig, PostsModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule { }
