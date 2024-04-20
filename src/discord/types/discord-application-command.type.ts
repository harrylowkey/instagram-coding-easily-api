import { DiscordApplicationCommandTypeEnum } from '~discord/enums/discord-application-command-type.enum';
import { ApplicationCommandOptionType } from './discord-application-command-option.type';

export type DiscordApplicationCommandType = {
    id: string;
    name: string;
    description: string;
    options?: ApplicationCommandOptionType[];
    type: DiscordApplicationCommandTypeEnum;
};
