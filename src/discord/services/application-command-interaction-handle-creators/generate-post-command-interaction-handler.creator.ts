import { PostBuilderService } from '~posts/services/post-builder.service';
import { ApplicationCommandInteractionHandlerCreator } from './application-command-interaction-handler.creator';
import { Response } from 'express';
import { GeneratePostCommandHandler } from '~discord/services/application-command-handlers/generate-post-command.handler';
import { DiscordInteractionDataType } from '~discord/types/discord-interaction-data.type';

export class GeneratePostCommandHandlerCreator extends ApplicationCommandInteractionHandlerCreator {
    public constructor(
        private postBuilderService: PostBuilderService,
        private data: DiscordInteractionDataType,
        private res: Response
    ) {
        super();
    }

    init(): GeneratePostCommandHandler {
        return new GeneratePostCommandHandler(this.postBuilderService, this.data, this.res);
    }
}
