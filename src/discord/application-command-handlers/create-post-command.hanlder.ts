import { InteractionResponseType } from 'discord-interactions';
import { Response } from 'express';
import { ApplicationCommandInteractionHandlerInterface } from '~discord/interfaces/appplication-command-interaction-handler.interface';
import { PostBuilderService } from '~posts/services/post-builder.service';

export class CreatePostCommandHandler implements ApplicationCommandInteractionHandlerInterface {
    constructor(
        private postBuilderService: PostBuilderService,
        private data: any,
        private res: Response
    ) { }

    handle(): Response {
        console.log(this.data);

        return this.res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: 'Generating post...' }
        });
    }
}
