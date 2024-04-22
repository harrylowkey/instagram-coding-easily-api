import { Module } from '@nestjs/common';
import { InstagramGraphModule } from '~instagram-graph/instagram-graph.module';
import { OpenAIModule } from '~openai/openai.module';
import { PostService } from './services/post.service';

@Module({
    imports: [OpenAIModule, InstagramGraphModule],
    providers: [PostService],
    exports: [PostService],
    controllers: []
})
export class PostModule {}
