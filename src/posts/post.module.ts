import { Module } from '@nestjs/common';
import { PostBuilderService } from './services/post-builder.service';
import { InstagramGraphModule } from '~instagram-graph/instagram-graph.module';
import { OpenAIModule } from '~openai/openai.module';

@Module({
    imports: [OpenAIModule, InstagramGraphModule],
    providers: [PostBuilderService],
    exports: [PostBuilderService],
    controllers: []
})
export class PostModule { }
