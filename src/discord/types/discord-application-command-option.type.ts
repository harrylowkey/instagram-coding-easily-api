import { DiscordApplicationCommandOptionTypeEnum } from '~discord/enums/discord-application-command-option-type.enum';
import { ApplicationCommandOptionChoiceType } from './discord-application-command-option-choice.type';

export type ApplicationCommandOptionType = {
    type: DiscordApplicationCommandOptionTypeEnum;
    name: string;
    description: string;
    required?: boolean;
    choices?: ApplicationCommandOptionChoiceType[];
};
