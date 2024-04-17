import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostBuilderService } from './services/post-builder.service';

@Module({
    providers: [PostBuilderService],
    exports: [PostBuilderService],
    controllers: [PostController]
})
export class PostModule {}
