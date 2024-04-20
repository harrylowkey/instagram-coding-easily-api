import { InteractionResponseType } from 'discord-interactions';
import { Response } from 'express';
import { ApplicationCommandInteractionHandlerInterface } from '~discord/interfaces/appplication-command-interaction-handler.interface';
import { PostBuilderService } from '~posts/services/post-builder.service';

export class GeneatePostCommandHandler implements ApplicationCommandInteractionHandlerInterface {
    constructor(
        private postBuilderService: PostBuilderService,
        private res: Response
    ) { }

    handle(): Response {
        this.postBuilderService.create();

        return this.res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: 'Generating post...' }
        });
    }
}
