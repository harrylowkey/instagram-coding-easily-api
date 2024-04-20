import { Global, Module } from '@nestjs/common';
import { DiscordController } from './http/controllers/discord.controller';
import { DiscordService } from './services/discord.service';

@Global()
@Module({
    imports: [],
    providers: [DiscordService],
    exports: [DiscordService],
    controllers: [DiscordController]
})
export class DiscordModule { }
