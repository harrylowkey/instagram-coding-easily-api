import { InteractionType } from 'discord-interactions';
import { ApplicationCommandDataType } from './discord-application-command-data.type';
import { DiscordModalSubmitDataType } from './discord-modal-submit-data.type';

export type DiscordInteractionType = {
    type: InteractionType;
    data: ApplicationCommandDataType | DiscordModalSubmitDataType;
};
