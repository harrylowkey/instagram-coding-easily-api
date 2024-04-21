import { InteractionType } from 'discord-interactions';
import { DiscordInteractionDataType } from './discord-interaction-data.type';

export type DiscordInteractionType = {
    type: InteractionType;
    data: DiscordInteractionDataType;
};
