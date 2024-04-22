import { Global, Module } from '@nestjs/common';
import { DiscordController } from './http/controllers/discord.controller';
import { DiscordService } from './services/discord.service';
import { PostModule } from '~posts/post.module';
import { DiscordClientService } from './services/discord-client.service';

@Global()
@Module({
    imports: [PostModule],
    providers: [DiscordService, DiscordClientService],
    exports: [DiscordService],
    controllers: [DiscordController]
})
export class DiscordModule {}
