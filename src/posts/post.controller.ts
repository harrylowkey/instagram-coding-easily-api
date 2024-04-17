import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostBuilderService } from './services/post-builder.service';

@Controller('posts')
@ApiTags('Posts')
export class PostController {
    constructor(private postBuilderService: PostBuilderService) {}

    @Get()
    generateImage() {
        return this.postBuilderService.generate();
    }
}
