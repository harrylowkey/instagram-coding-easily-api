import { forwardRef, Module } from '@nestjs/common';
import { DiscordModule } from '~discord/discord.module';
import { InstagramGraphModule } from '~instagram-graph/instagram-graph.module';
import { OpenAIModule } from '~openai/openai.module';
import { OpenAIPostService } from './services/openai-post.service';
import { PostService } from './services/post.service';

@Module({
    imports: [OpenAIModule, InstagramGraphModule, forwardRef(() => DiscordModule)],
    providers: [PostService, OpenAIPostService],
    exports: [PostService, OpenAIPostService],
    controllers: []
})
export class PostModule {}
