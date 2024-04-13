import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ImageBuilder } from '~code2image/services/image-builder.service';

@Injectable()
export class PostService {
    constructor() { }

    async generateImage(response: Response) {
        const code = 'console.log("Hello, World!")';
        const params = {
            code,
            theme: 'a11y-dark',
            language: 'typescript',
            lineNumbers: false,
            showBackground: true
        };

        await new ImageBuilder(response, params).generateImage();
    }
}
