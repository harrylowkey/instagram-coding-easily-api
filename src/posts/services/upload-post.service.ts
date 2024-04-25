import { InstagramGraphService } from '~instagram-graph/services/instagram-graph.service';
import { Injectable, Logger } from '@nestjs/common';
import { DiscordClientService } from '~discord/services/discord-client.service';
import { PreviewPostService } from './preview-post.service';
import { UploadPostInterface } from '~posts/interfaces/upload-post.interface';
import { UPLOAD_POST_PENDING_TIME } from '~posts/constants/upload-post-pending-time.constant';
/* eslint-disable @typescript-eslint/naming-convention */
const UPLOADING_JOBS = {};

@Injectable()
export class UploadPostService implements UploadPostInterface {
    private readonly logger = new Logger(UploadPostService.name);

    constructor(
        private instagramGraphService: InstagramGraphService,
        private discordClientService: DiscordClientService,
        private previewPostService: PreviewPostService
    ) {}

    async sendFollowUpMessage(interactionToken: string, content: string): Promise<void> {
        await this.discordClientService.createFollowUpMessage(interactionToken, {
            content
        });
    }

    async upload(imageUrls: string[], caption: string, interactionToken?: string): Promise<void> {
        const isSimplePost = imageUrls.length === 1;
        try {
            if (isSimplePost) {
                await this.instagramGraphService.uploadSimplePost({
                    imageUrl: imageUrls[0],
                    caption
                });
            } else {
                await this.instagramGraphService.uploadCarouselPost({
                    imageUrls,
                    caption
                });
            }

            if (interactionToken) {
                await this.sendFollowUpMessage(interactionToken, 'Successfully uploaded post');
            }

            this.logger.log('Successfully uploaded post');
        } catch (error) {
            const errorMessage = `Failed to upload post: ${error.response}`;

            this.logger.error(errorMessage);
            await this.discordClientService.reportBug(
                this.previewPostService.generatePreviewPost(imageUrls, caption, errorMessage)
            );
        }
    }

    async confirmUpload(
        interactionId: string,
        interactionToken: string,
        imageUrls: string[],
        caption?: string
    ): Promise<void> {
        await this.discordClientService.createFollowUpMessage(
            interactionToken,
            this.previewPostService.generatePreviewConfirmUploadPost(imageUrls, caption)
        );

        UPLOADING_JOBS[interactionId] = setTimeout(async () => {
            await this.upload(imageUrls, caption, interactionToken);
            delete UPLOADING_JOBS[interactionId];
        }, UPLOAD_POST_PENDING_TIME);
    }

    cancelUpload(interactionId: string): void {
        clearTimeout(UPLOADING_JOBS[interactionId]);
    }
}
