import { ApplicationCommandInteractionHandlerCreator } from './application-command-interaction-handler.creator';
import { Response } from 'express';
import { ApplicationCommandDataType } from '~discord/types/discord-application-command-data.type';
import { CreatePostWithImageCommandHandler } from '../handlers/create-post-with-image-command.handler';
import { PostService } from '~posts/services/post.service';

export class CreatePostWithImageCommandHandlerCreator extends ApplicationCommandInteractionHandlerCreator {
    public constructor(
        private postService: PostService,
        private data: ApplicationCommandDataType,
        private res: Response
    ) {
        super();
    }

    init(): CreatePostWithImageCommandHandler {
        return new CreatePostWithImageCommandHandler(this.postService, this.data, this.res);
    }
}
