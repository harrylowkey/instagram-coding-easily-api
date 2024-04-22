import { ApplicationCommandInteractionHandlerCreator } from './application-command-interaction-handler.creator';
import { Response } from 'express';
import { CreatePostWithCodeCommandHandler } from '../handlers/create-post-with-code-command.handler';

export class CreatePostWithCodeCommandHandlerCreator extends ApplicationCommandInteractionHandlerCreator {
    public constructor(private res: Response) {
        super();
    }

    init(): CreatePostWithCodeCommandHandler {
        return new CreatePostWithCodeCommandHandler(this.res);
    }
}
