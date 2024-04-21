import { PostBuilderService } from '~posts/services/post-builder.service';
import { ApplicationCommandInteractionHandlerCreator } from './application-command-interaction-handler.creator';
import { Response } from 'express';
import { GeneatePostCommandHandler } from '~discord/services/application-command-handlers/generate-post-command.handler';

export class GeneratePostCommandIntefactionHandlerCreator extends ApplicationCommandInteractionHandlerCreator {
    public constructor(
        private postBuilderService: PostBuilderService,
        private res: Response
    ) {
        super();
    }

    init(): GeneatePostCommandHandler {
        return new GeneatePostCommandHandler(this.postBuilderService, this.res);
    }
}
