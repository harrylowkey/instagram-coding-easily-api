import { PostBuilderService } from '~posts/services/post-builder.service';
import { ApplicationCommandInteractionHandlerCreator } from './application-command-interaction-handler.creator';
import { Response } from 'express';
import { DiscordInteractionDataType } from '~discord/types/discord-interaction-data.type';
import { CreatePostWithImageCommandHandler } from '../application-command-handlers/create-post-with-image-command.handler';

export class CreatePostWithImageCommandHandlerCreator extends ApplicationCommandInteractionHandlerCreator {
    public constructor(
        private postBuilderService: PostBuilderService,
        private data: DiscordInteractionDataType,
        private res: Response
    ) {
        super();
    }

    init(): CreatePostWithImageCommandHandler {
        return new CreatePostWithImageCommandHandler(this.postBuilderService, this.data, this.res);
    }
}
