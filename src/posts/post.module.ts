import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostBuilderService } from './services/post-builder.service';
import { InstagramGraphModule } from '~instagram-graph/instagram-graph.module';
import { OpenAIModule } from '~openai/openai.module';

@Module({
    imports: [OpenAIModule, InstagramGraphModule],
    providers: [PostBuilderService],
    exports: [PostBuilderService],
    controllers: [PostController]
})
export class PostModule { }
