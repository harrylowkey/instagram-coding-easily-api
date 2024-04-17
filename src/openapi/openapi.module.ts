import { Global, Module } from '@nestjs/common';
import { OpenAIService } from './services/openapi.service';

@Global()
@Module({
    imports: [],
    providers: [OpenAIService],
    exports: [OpenAIService],
    controllers: []
})
export class OpenAIModule {}
