import { DiscordApplicationCommandOptionTypeEnum } from '~discord/enums/discord-application-command-option-type.enum';
import { DiscordApplicationCommandTypeEnum } from '~discord/enums/discord-application-command-type.enum';

export type CommandOptionChoiceType = {
    name: string;
    value: string | number;
};

export type CommandOptionType = {
    type: DiscordApplicationCommandOptionTypeEnum;
    name: string;
    description: string;
    required?: boolean;
    choices?: CommandOptionChoiceType[];
};

export type DiscordCommandType = {
    id?: string;
    name: string;
    description: string;
    options?: CommandOptionType[];
    type?: DiscordApplicationCommandTypeEnum;
};
