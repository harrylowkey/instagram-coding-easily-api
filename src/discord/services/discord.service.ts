import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { InteractionResponseType, InteractionType } from 'discord-interactions';
import { DiscordInteractionDto } from '~discord/http/dto/discord-interaction.dto';
import { PostBuilderService } from '~posts/services/post-builder.service';

@Injectable()
export class DiscordService {
    constructor(private postBuilderService: PostBuilderService) {}

    handleDiscordBotInteraction(dto: DiscordInteractionDto, res: Response): Response {
        const { type, data } = dto;

        if (type === InteractionType.PING) {
            return res.send({ type: InteractionResponseType.PONG });
        }

        if (type === InteractionType.APPLICATION_COMMAND) {
            if (data.name === 'test') {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: { content: `Hello, I'm the instagram coding-easily bot!` }
                });
            }

            if (data.name === 'generate-post') {
                this.postBuilderService.generate();

                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: { content: 'Generating post...' }
                });
            }

            if (data.name == 'create-post') {
                console.log({ data: data.options });
            }
        }
    }
}
