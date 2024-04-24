import { forwardRef, Module } from '@nestjs/common';
import { PostModule } from '~posts/post.module';
import { GeneratePostCronService } from './crons/generate-post.cron';
import { OpenAIService } from './services/openai.service';

@Module({
    imports: [forwardRef(() => PostModule)],
    providers: [OpenAIService, GeneratePostCronService],
    exports: [OpenAIService],
    controllers: []
})
export class OpenAIModule {}
