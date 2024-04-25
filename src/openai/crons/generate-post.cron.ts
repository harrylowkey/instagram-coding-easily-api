import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DiscordClientService } from '~discord/services/discord-client.service';
import { OpenAIPostService } from '~posts/services/openai-post.service';
import { PreviewPostService } from '~posts/services/preview-post.service';
import { UploadPostService } from '~posts/services/upload-post.service';

@Injectable()
export class GeneratePostCronService {
    constructor(
        private openAIPostService: OpenAIPostService,
        private uploadPostService: UploadPostService,
        private discordClientService: DiscordClientService,
        private previewPostService: PreviewPostService
    ) {}

    @Cron('0 9,15,20 * * *') // at  9 am, 3 pm, and 8 pm every day,
    async generatePost(): Promise<void> {
        const { mediaUrls, caption } = await this.openAIPostService.preparePost();
        await this.uploadPostService.upload(mediaUrls, caption);

        await this.discordClientService.sendMessageToMainChannel(
            this.previewPostService.generatePreviewPostData(mediaUrls, caption)
        );
    }
}
