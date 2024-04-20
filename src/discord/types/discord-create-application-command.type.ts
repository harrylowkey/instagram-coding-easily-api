import { DiscordApplicationCommandTypeEnum } from '~discord/enums/discord-application-command-type.enum';
import { ApplicationCommandOptionType } from './discord-application-command-option.type';

export type DiscordCreateApplicationCommandType = {
    name: string;
    description: string;
    options?: ApplicationCommandOptionType[];
    type?: DiscordApplicationCommandTypeEnum;
};
