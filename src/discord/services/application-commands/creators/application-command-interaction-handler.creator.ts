import { Response } from 'express';
import { ApplicationCommandInteractionHandlerInterface } from '~discord/interfaces/application-command-interaction-handler.interface';

export abstract class ApplicationCommandInteractionHandlerCreator {
    abstract init(): ApplicationCommandInteractionHandlerInterface;

    handle(): Response {
        return this.init().handle();
    }
}
