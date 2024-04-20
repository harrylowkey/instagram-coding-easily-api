import { Response } from 'express';

export interface ApplicationCommandInteractionHandlerInterface {
    handle(): Response;
}
