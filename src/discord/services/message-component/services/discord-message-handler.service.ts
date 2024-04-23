/* eslint-disable @typescript-eslint/naming-convention */

import { Response } from 'express';
import { DiscordInteractionType } from '~discord/types/discord-interaction.type';
import { UploadPostService } from '~posts/services/upload-post.service';
import { Injectable } from '@nestjs/common';
import { DiscordModalSubmitDataType } from '~discord/types/discord-modal-submit-data.type';
import { InteractionResponseType } from 'discord-interactions';

@Injectable()
export class DiscordMessageHandlerService {
    constructor(private uploadPostService: UploadPostService) {}

    response(res: Response, content: string): Response {
        return res.send({ type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: { content } });
    }

    handle(dto: DiscordInteractionType, res: Response): Response {
        const { message, data } = dto;

        const { id: interactionId } = message.interaction_metadata;

        const isAcceptUpload = (data as DiscordModalSubmitDataType).custom_id === 'accept-btn';
        if (!isAcceptUpload) {
            this.uploadPostService.cancelUpload(interactionId);
            return this.response(res, 'Upload canceled');
        }

        return this.response(res, 'Confirm! Post will be uploaded soon');
    }
}
