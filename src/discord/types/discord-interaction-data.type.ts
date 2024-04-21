import { DiscordApplicationCommandTypeEnum } from '~discord/enums/discord-application-command-type.enum';
import { ApplicationCommandInteractionOptionType } from './discord-application-command-interaction-option.type';

export type DiscordInteractionDataType = {
    id: string;
    name: string;
    type: DiscordApplicationCommandTypeEnum;
    options?: ApplicationCommandInteractionOptionType[];
};
