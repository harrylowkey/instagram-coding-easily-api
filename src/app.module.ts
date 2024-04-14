import { Module } from '@nestjs/common';
import { PostsModule } from '~posts/post.module';
import { serveStaticConfig } from '~config/serve-static.config';

@Module({
    imports: [serveStaticConfig, PostsModule],
    controllers: [],
    providers: []
})
export class AppModule {}
