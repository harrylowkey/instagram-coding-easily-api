import { Module } from '@nestjs/common';
import { PostModule } from '~posts/post.module';
import { HttpClientModule } from '~http-client/http-client.module';
import { InstagramGraphModule } from '~instagram-graph/instagram-graph.module';
import { StorageModule } from '~storage/storage.module';
import { OpenAIModule } from '~openai/openai.module';
import { code2ImageConfig } from '~config/code2image.config';
import { serveStaticConfig } from '~config/serve-static.config';
import { DiscordModule } from '~discord/discord.module';

@Module({
    imports: [
        code2ImageConfig,
        serveStaticConfig,
        PostModule,
        InstagramGraphModule,
        HttpClientModule,
        StorageModule,
        OpenAIModule,
        DiscordModule
    ],
    controllers: [],
    providers: []
})
export class AppModule { }
