import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { PostService } from './post.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('posts')
@ApiTags('Posts')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get()
    generateImage(@Res() response: Response) {
        return this.postService.generateImage(response);
    }
}
