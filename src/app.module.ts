import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PostModule } from '~posts/post.module';
import { HttpClientModule } from '~http-client/http-client.module';
import { InstagramGraphModule } from '~instagram-graph/instagram-graph.module';
import { StorageModule } from '~storage/storage.module';
import { OpenAIModule } from '~openai/openai.module';
import { code2ImageConfig } from '~config/code2image.config';
import { serveStaticConfig } from '~config/serve-static.config';
import { DiscordModule } from '~discord/discord.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '~core/filters/http-exception.filter';
import { VerifyDiscordRequestMiddleware } from '~core/middlewares/verify-discord-request.middleware';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        code2ImageConfig,
        serveStaticConfig,
        ScheduleModule.forRoot(),
        PostModule,
        InstagramGraphModule,
        HttpClientModule,
        StorageModule,
        OpenAIModule,
        DiscordModule
    ],
    controllers: [],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        }
    ]
})
export class AppModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(VerifyDiscordRequestMiddleware).forRoutes('/discords/*');
    }
}
