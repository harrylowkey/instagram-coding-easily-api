import { ApplicationCommandInteractionHandlerCreator } from './application-command-interaction-handler.creator';
import { Response } from 'express';
import { CreatePostWithImageCommandHandler } from '../handlers/create-post-with-image-command.handler';
import { PostService } from '~posts/services/post.service';
import { DiscordInteractionType } from '~discord/types/discord-interaction.type';

export class CreatePostWithImageCommandHandlerCreator extends ApplicationCommandInteractionHandlerCreator {
    public constructor(
        private postService: PostService,
        private dto: DiscordInteractionType,
        private res: Response
    ) {
        super();
    }

    init(): CreatePostWithImageCommandHandler {
        return new CreatePostWithImageCommandHandler(this.postService, this.dto, this.res);
    }
}
