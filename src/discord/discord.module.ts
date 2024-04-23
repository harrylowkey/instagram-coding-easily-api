import { forwardRef, Global, Module } from '@nestjs/common';
import { DiscordController } from './http/controllers/discord.controller';
import { DiscordService } from './services/discord.service';
import { PostModule } from '~posts/post.module';
import { DiscordClientService } from './services/discord-client.service';
import { CreatePostWithCodeModalSubmitHandlerService } from './services/modal-submit/services/create-post-with-code-modal-submit-handler.service';
import { DiscordMessageHandlerService } from './services/message-component/services/discord-message-handler.service';

@Global()
@Module({
    imports: [forwardRef(() => PostModule)],
    providers: [
        DiscordService,
        DiscordClientService,
        CreatePostWithCodeModalSubmitHandlerService,
        DiscordMessageHandlerService
    ],
    exports: [DiscordService, DiscordClientService],
    controllers: [DiscordController]
})
export class DiscordModule {}
