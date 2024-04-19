import { Module } from '@nestjs/common';
import { OpenAIService } from './services/openai.service';

@Module({
    imports: [],
    providers: [OpenAIService],
    exports: [OpenAIService],
    controllers: []
})
export class OpenAIModule { }
