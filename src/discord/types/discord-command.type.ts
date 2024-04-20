import { DiscordApplicationCommandOptionTypeEnum } from '~discord/enumts/discord-application-command-option-type.enum';
import { DiscordApplicationCommandTypeEnum } from '~discord/enumts/discord-application-command-type.enum';

type CommandOptionChoiceType = {
    name: string;
    value: string | number;
};

type CommandOptionType = {
    type: DiscordApplicationCommandOptionTypeEnum;
    name: string;
    description: string;
    required?: boolean;
    choices?: CommandOptionChoiceType[];
};

export type DiscordCommandType = {
    name: string;
    description: string;
    options?: CommandOptionType[];
    type: DiscordApplicationCommandTypeEnum;
};
