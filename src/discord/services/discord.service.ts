import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { InteractionResponseType, InteractionType } from 'discord-interactions';
import { DiscordInteractionDto } from '~discord/http/dto/discord-interaction.dto';

@Injectable()
export class DiscordService {
    handleDiscordBotInteraction(dto: DiscordInteractionDto, res: Response) {
        const { type, data } = dto;

        if (type === InteractionType.APPLICATION_COMMAND) {
            if (data.name === 'test') {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: { content: 'A wild message appeared' }
                });
            }
        }

        if (type === InteractionType.PING) {
            console.log('here');
            return res.send({ type: InteractionResponseType.PONG });
        }
    }
}
