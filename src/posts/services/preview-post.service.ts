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

    generatePreviewPostData(imageUrls: string[], caption?: string, description?: string): any {
        const content =
            caption ||
            `Generated post successfully! :white_check_mark:\nPost will be uploaded in :one: minutes. Skip or click **OK** to confirm upload / click **Cancel** to reject uploading.`;

        return {
            content: content,
            embeds: imageUrls.map((url) => ({
                type: 'image',
                image: { url },
                description: description,
                title: 'Preview post'
            }))
        };
    }

    generateUploadedPost(imageUrls: string[], caption?: string, description?: string): Promise<void> {
        return snakecaseKeys(this.generatePreviewPostData(imageUrls, caption, description));
    }

    generatePreviewPost(imageUrls: string[], caption?: string): Promise<void> {
        return snakecaseKeys({
            ...this.generatePreviewPostData(imageUrls, caption),
            ...this.generateComfirmationButtions()
        });
    }
}
