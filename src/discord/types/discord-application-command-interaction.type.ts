import { DiscordApplicationCommandTypeEnum } from '~discord/enums/discord-application-command-type.enum';

export type ApplicationCommandInteractionOptionType = {
    name: string;
    value: string;
};

export type DiscordApplicationCommandInteractionType = {
    id: string;
    name: string;
    type: DiscordApplicationCommandTypeEnum;
    options?: ApplicationCommandInteractionOptionType[];
};
