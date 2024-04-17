import { Module } from '@nestjs/common';
import { PostModule } from '~posts/post.module';
import { serveStaticConfig } from '~config/serve-static.config';
import { HttpClientModule } from '~http-client/http-client.module';
import { InstagramGraphModule } from '~instagram-graph/instagram-graph.module';
import { StorageModule } from '~storage/storage.module';
import { OpenAIModule } from '~openapi/openapi.module';

@Module({
    imports: [serveStaticConfig, PostModule, InstagramGraphModule, HttpClientModule, StorageModule, OpenAIModule],
    controllers: [],
    providers: []
})
export class AppModule {}
