import { DiscordApplicationCommandOptionTypeEnum } from '~discord/enums/discord-application-command-option-type.enum';
import { DiscordApplicationCommandTypeEnum } from '~discord/enums/discord-application-command-type.enum';

export type ApplicationCommandOptionChoiceType = {
    name: string;
    value: string | number;
};

export type ApplicationCommandOptionType = {
    type: DiscordApplicationCommandOptionTypeEnum;
    name: string;
    description: string;
    required?: boolean;
    choices?: ApplicationCommandOptionChoiceType[];
};

export type DiscordCreateApplicationCommandType = {
    id?: string;
    name: string;
    description: string;
    options?: ApplicationCommandOptionType[];
    type?: DiscordApplicationCommandTypeEnum;
};
