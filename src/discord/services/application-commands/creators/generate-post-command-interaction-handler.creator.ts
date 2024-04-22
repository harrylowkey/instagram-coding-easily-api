import { ApplicationCommandInteractionHandlerCreator } from './application-command-interaction-handler.creator';
import { Response } from 'express';
import { ApplicationCommandDataType } from '~discord/types/discord-application-command-data.type';
import { GeneratePostCommandHandler } from '../handlers/generate-post-command.handler';
import { PostService } from '~posts/services/post.service';

export class GeneratePostCommandHandlerCreator extends ApplicationCommandInteractionHandlerCreator {
    public constructor(
        private postService: PostService,
        private data: ApplicationCommandDataType,
        private res: Response
    ) {
        super();
    }

    init(): GeneratePostCommandHandler {
        return new GeneratePostCommandHandler(this.postService, this.data, this.res);
    }
}
