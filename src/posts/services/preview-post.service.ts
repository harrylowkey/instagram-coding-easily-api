import { ButtonStyleTypes, MessageComponentTypes } from 'discord-interactions';
import snakecaseKeys from 'snakecase-keys';

export class PreviewPostService implements PreviewPostService {
    generateComfirmationButtions(): any {
        return {
            components: [
                {
                    customId: 'accept-btn',
                    type: MessageComponentTypes.ACTION_ROW,
                    components: [
                        {
                            type: MessageComponentTypes.BUTTON,
                            customId: 'accept-btn',
                            label: 'OK',
                            style: ButtonStyleTypes.SUCCESS
                        }
                    ]
                },
                {
                    customId: 'cancel-btn',
                    type: MessageComponentTypes.ACTION_ROW,
                    components: [
                        {
                            type: MessageComponentTypes.BUTTON,
                            customId: 'cancel-btn',
                            label: 'Cancel',
                            style: ButtonStyleTypes.DANGER
                        }
                    ]
                }
            ]
        };
    }

    generatePreviewPostData(imageUrls: string[], caption?: string, message?: string): any {
        const content =
            message ||
            `Generated post successfully! :white_check_mark:\nPost will be uploaded in :one: minutes. Skip or click **OK** to confirm upload / click **Cancel** to reject uploading.`;

        const embeds = [
            {
                type: 'image',
                image: { url: imageUrls[0] },
                description: caption,
                title: 'Preview post'
            }
        ];

        return { content, embeds };
    }

    generatePreviewPost(imageUrls: string[], caption?: string, message?: string): Promise<void> {
        return snakecaseKeys(this.generatePreviewPostData(imageUrls, caption, message));
    }

    generatePreviewConfirmUploadPost(imageUrls: string[], caption?: string): Promise<void> {
        return snakecaseKeys({
            ...this.generatePreviewPostData(imageUrls, caption),
            ...this.generateComfirmationButtions()
        });
    }
}
