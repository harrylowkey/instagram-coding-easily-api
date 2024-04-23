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
import { CreatePostWithCodeModalSubmitHandlerService } from './modal-submit/services/create-post-with-code-modal-submit-handler.service';
import { PostService } from '~posts/services/post.service';
import { DiscordMessageHandlerService } from './message-component/services/discord-message-handler.service';

@Injectable()
export class DiscordService {
    constructor(
        private postService: PostService,
        private discordMessageHandlerService: DiscordMessageHandlerService
    ) {}

    #handleApplicationCommandInteraction(dto: DiscordInteractionType, res: Response): Response {
        const { name: commandName } = dto.data as ApplicationCommandDataType;

        switch (commandName) {
            case 'generate-post':
                return new GeneratePostCommandHandlerCreator(this.postService, dto, res).handle();
            case 'create-post-with-image':
                return new CreatePostWithImageCommandHandlerCreator(this.postService, dto, res).handle();
            case 'create-post-with-code':
                return new CreatePostWithCodeCommandHandler(res).handle();
            default:
                throw new NotImplementedException();
        }
    }

    #handleModelSubmitInteraction(dto: DiscordInteractionType, res: Response): Response {
        const { custom_id } = dto.data as DiscordModalSubmitDataType;

        if (custom_id == 'create-post-with-code-modal') {
            return new CreatePostWithCodeModalSubmitHandlerService(this.postService, dto, res).handle();
        }

        throw new NotImplementedException();
    }

    #handleMessageComponentInteraction(dto: DiscordInteractionType, res: Response): Response {
        return this.discordMessageHandlerService.handle(dto, res);
    }

    handleDiscordBotInteraction(dto: DiscordInteractionType, res: Response): Response {
        const { type } = dto;

        switch (type) {
            case InteractionType.PING:
                return res.send({ type: InteractionResponseType.PONG });
            case InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE:
                return res.send({ type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT });
            case InteractionType.MESSAGE_COMPONENT:
                return this.#handleMessageComponentInteraction(dto, res);
            case InteractionType.MODAL_SUBMIT:
                return this.#handleModelSubmitInteraction(dto, res);
            case InteractionType.APPLICATION_COMMAND:
                return this.#handleApplicationCommandInteraction(dto, res);
            default:
                throw new NotImplementedException();
        }
    }
}
