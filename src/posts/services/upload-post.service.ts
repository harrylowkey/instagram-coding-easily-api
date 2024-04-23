import { InstagramGraphService } from '~instagram-graph/services/instagram-graph.service';
import { Injectable } from '@nestjs/common';
import { DiscordClientService } from '~discord/services/discord-client.service';
import { PreviewPostService } from './preview-post.service';
import { UploadPostInterface } from '~posts/interfaces/upload-post.interface';
import { UPLOAD_POST_PENDING_TIME } from '~posts/constants/upload-post-pending-time.constant';

/* eslint-disable @typescript-eslint/naming-convention */
const UPLOADING_JOBS = {};

@Injectable()
export class UploadPostService implements UploadPostInterface {
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

    async upload(interactionToken: string, imageUrls: string[], caption: string): Promise<void> {
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

            await this.sendFollowUpMessage(interactionToken, 'Successfully uploaded post');
        } catch (error) {
            console.log('Failed to upload post', error.response);
            await this.sendFollowUpMessage(interactionToken, `Failed to upload post: ${error.response}`);
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
            this.previewPostService.generatePreviewPost(imageUrls, caption)
        );

        UPLOADING_JOBS[interactionId] = setTimeout(async () => {
            await this.upload(interactionToken, imageUrls, caption);
            delete UPLOADING_JOBS[interactionId];
        }, UPLOAD_POST_PENDING_TIME);
    }

    cancelUpload(interactionId: string): void {
        clearTimeout(UPLOADING_JOBS[interactionId]);
    }
}
