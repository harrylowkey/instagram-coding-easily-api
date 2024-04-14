import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Instagram Code Learn API')
        .setDescription('Instagram Code Learn API description')
        .setVersion('1.0')
        .addTag('instaagram-code-learn')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}
bootstrap();
