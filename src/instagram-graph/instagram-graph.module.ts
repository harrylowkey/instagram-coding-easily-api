import { Global, Module } from '@nestjs/common';
import { InstagramGraphService } from './services/instagram-graph.service';

@Global()
@Module({
    imports: [],
    providers: [InstagramGraphService],
    exports: [InstagramGraphService],
    controllers: []
})
export class InstagramGraphModule { }
