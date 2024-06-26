import { ApplicationCommandInteractionHandlerCreator } from './application-command-interaction-handler.creator';
import { Response } from 'express';
import { GeneratePostCommandHandler } from '../handlers/generate-post-command.handler';
import { PostService } from '~posts/services/post.service';
import { DiscordInteractionType } from '~discord/types/discord-interaction.type';

export class GeneratePostCommandHandlerCreator extends ApplicationCommandInteractionHandlerCreator {
    public constructor(
        private postService: PostService,
        private dto: DiscordInteractionType,
        private res: Response
    ) {
        super();
    }

    init(): GeneratePostCommandHandler {
        return new GeneratePostCommandHandler(this.postService, this.dto, this.res);
    }
}
