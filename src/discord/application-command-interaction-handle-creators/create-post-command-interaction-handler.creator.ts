import { PostBuilderService } from '~posts/services/post-builder.service';
import { ApplicationCommandInteractionHandlerCreator } from './application-command-interaction-handler.creator';
import { Response } from 'express';
import { CreatePostCommandHandler } from '~discord/application-command-handlers/create-post-command.hanlder';
import { DiscordApplicationCommandInteractionType } from '~discord/types/discord-application-command-interaction.type';

export class CreatePostCommandIntefactionHandlerCreator extends ApplicationCommandInteractionHandlerCreator {
    public constructor(
        private postBuilderService: PostBuilderService,
        private data: DiscordApplicationCommandInteractionType,
        private res: Response
    ) {
        super();
    }

    init(): CreatePostCommandHandler {
        return new CreatePostCommandHandler(this.postBuilderService, this.data, this.res);
    }
}
