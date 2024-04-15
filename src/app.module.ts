import { Module } from '@nestjs/common';
import { PostsModule } from '~posts/post.module';
import { serveStaticConfig } from '~config/serve-static.config';
import { HttpClientModule } from '~http-client/http-client.module';
import { InstagramGraphModule } from '~instagram-graph/instagram-graph.module';

@Module({
    imports: [serveStaticConfig, PostsModule, InstagramGraphModule, HttpClientModule],
    controllers: [],
    providers: []
})
export class AppModule { }
