import { forwardRef, Module } from '@nestjs/common';
import { DiscordModule } from '~discord/discord.module';
import { InstagramGraphModule } from '~instagram-graph/instagram-graph.module';
import { OpenAIModule } from '~openai/openai.module';
import { OpenAIPostService } from './services/openai-post.service';
import { PostService } from './services/post.service';
import { PreviewPostService } from './services/preview-post.service';
import { UploadPostService } from './services/upload-post.service';

@Module({
    imports: [OpenAIModule, InstagramGraphModule, forwardRef(() => DiscordModule)],
    providers: [PostService, OpenAIPostService, PreviewPostService, UploadPostService],
    exports: [PostService, OpenAIPostService, UploadPostService],
    controllers: []
})
export class PostModule {}
