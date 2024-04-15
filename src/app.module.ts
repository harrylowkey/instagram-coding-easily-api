import { Module } from '@nestjs/common';
import { PostsModule } from '~posts/post.module';
import { serveStaticConfig } from '~config/serve-static.config';
import { HttpClientModule } from '~http-client/http-client.module';
import { InstagramGraphModule } from '~instagram-graph/instagram-graph.module';
import { StorageModule } from '~storage/storage.module';

@Module({
    imports: [serveStaticConfig, PostsModule, InstagramGraphModule, HttpClientModule, StorageModule],
    controllers: [],
    providers: []
})
export class AppModule {}
