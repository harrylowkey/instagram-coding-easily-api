/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, NotImplementedException } from '@nestjs/common';
import { Response } from 'express';
import { InteractionResponseType, InteractionType } from 'discord-interactions';
import { ApplicationCommandDataType } from '~discord/types/discord-application-command-data.type';
import { DiscordInteractionType } from '~discord/types/discord-interaction.type';
import { DiscordModalSubmitDataType } from '~discord/types/discord-modal-submit-data.type';
import { GeneratePostCommandHandlerCreator } from './application-commands/creators/generate-post-command-interaction-handler.creator';
import { CreatePostWithImageCommandHandlerCreator } from './application-commands/creators/create-post-with-image-command-interaction-handler.creator';
import { CreatePostWithCodeCommandHandler } from './application-commands/handlers/create-post-with-code-command.handler';
import { CreatePostWithCodeModalSubmitHandler } from './modal-submit/services/create-post-with-code-modal-submit-handler.service';
import { PostService } from '~posts/services/post.service';

@Injectable()
export class DiscordService {
    constructor(private postService: PostService) {}

    #handleApplicationCommandInteraction(data: ApplicationCommandDataType, res: Response): Response {
        const { name: commandName } = data;

        switch (commandName) {
            case 'generate-post':
                return new GeneratePostCommandHandlerCreator(this.postService, data, res).handle();
            case 'create-post-with-image':
                return new CreatePostWithImageCommandHandlerCreator(this.postService, data, res).handle();
            case 'create-post-with-code':
                return new CreatePostWithCodeCommandHandler(res).handle();
            default:
                throw new NotImplementedException();
        }
    }

    #handleModelSubmitInteraction(data: DiscordModalSubmitDataType, res: Response): Response {
        const { custom_id } = data;

        if (custom_id == 'create-post-with-code-modal') {
            return new CreatePostWithCodeModalSubmitHandler(this.postService, data, res).handle();
        }

        throw new NotImplementedException();
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
                return this.#handleModelSubmitInteraction(data as DiscordModalSubmitDataType, res);
            case InteractionType.APPLICATION_COMMAND:
                return this.#handleApplicationCommandInteraction(data as ApplicationCommandDataType, res);
            default:
                throw new NotImplementedException();
        }
    }
}
