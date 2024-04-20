import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '~app.module';
import { env } from '~config/env.config';
import { MAXIMUM_PAYLOAD_SIZE } from '~core/constants/app.constant';

export class Bootstrap {
    private app: NestExpressApplication;

    async initApp(): Promise<void> {
        this.app = await NestFactory.create<NestExpressApplication>(AppModule);
        this.app.use(json({ limit: MAXIMUM_PAYLOAD_SIZE }));
        this.app.use(urlencoded({ extended: true, limit: MAXIMUM_PAYLOAD_SIZE }));
    }

    buildSwagger(): void {
        const config = new DocumentBuilder()
            .setTitle('Instagram Coding Easily API')
            .setDescription('Instagram Code Learn API description')
            .setVersion('0.0.1')
            .addTag('instagram-coding-easily-api')
            .build();

        const document = SwaggerModule.createDocument(this.app, config);
        SwaggerModule.setup('api', this.app, document);
    }

    async start(): Promise<void> {
        await this.app.listen(env.APP_PORT);
    }
}
