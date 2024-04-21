import { Injectable, NotImplementedException } from '@nestjs/common';
import { Response } from 'express';
import { InteractionResponseType, InteractionType } from 'discord-interactions';
import { PostBuilderService } from '~posts/services/post-builder.service';
import { GeneratePostCommandIntefactionHandlerCreator } from '~discord/services/application-command-interaction-handle-creators/generate-post-command-interaction-handler.creator';
import { CreatePostCommandIntefactionHandlerCreator } from '~discord/services/application-command-interaction-handle-creators/create-post-command-interaction-handler.creator';
import { DiscordInteractionDataType } from '~discord/types/discord-interaction-data.type';
import { DiscordInteractionType } from '~discord/types/discord-interaction.type';

@Injectable()
export class DiscordService {
    constructor(private postBuilderService: PostBuilderService) {}

    #handleApplicationCommandInteraction(data: DiscordInteractionDataType, res: Response): Response {
        const { name: commandName } = data;

        switch (commandName) {
            case 'create-post':
                return new CreatePostCommandIntefactionHandlerCreator(this.postBuilderService, data, res).handle();
            case 'generate-post':
                return new GeneratePostCommandIntefactionHandlerCreator(this.postBuilderService, res).handle();
        }
    }

    handleDiscordBotInteraction(dto: DiscordInteractionType, res: Response): Response {
        const { type, data } = dto;

        switch (type) {
            case InteractionType.PING:
                return res.send({ type: InteractionResponseType.PONG });
            case InteractionType.MESSAGE_COMPONENT:
                return res.send({ type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE });
            case InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE:
                return res.send({ type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT });
            case InteractionType.MODAL_SUBMIT:
                return res.send({ type: InteractionResponseType.UPDATE_MESSAGE });
            case InteractionType.APPLICATION_COMMAND:
                return this.#handleApplicationCommandInteraction(data, res);
            default:
                throw new NotImplementedException();
        }
    }
}
