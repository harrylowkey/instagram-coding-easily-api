import { LanguageEnum } from '@harrylowkey/code2image';
import { DiscordApplicationCommandOptionTypeEnum } from '~discord/enums/discord-application-command-option-type.enum';
import { CommandOptionChoiceType, DiscordCommandType } from '~discord/types/discord-command.type';
import { PostTopicEnum } from '~posts/enums/post-topic.enum';

export class DiscordCommandService {
    static #createTopicChoices(): CommandOptionChoiceType[] {
        const topics = Object.values(PostTopicEnum);
        return topics.reduce((choices, topic) => [...choices, { name: topic, value: topic }], []);
    }

    static #createLanguageChoices(): CommandOptionChoiceType[] {
        const languages = Object.values(LanguageEnum);
        return languages.reduce((choices, language) => [...choices, { name: language, value: language }], []);
    }

    static createPostCommand(): DiscordCommandType {
        return {
            name: 'create-post',
            description: 'Create and upload post manually command',
            options: [
                {
                    name: 'topic',
                    description: 'Select a topic',
                    type: DiscordApplicationCommandOptionTypeEnum.STRING,
                    required: false,
                    choices: this.#createTopicChoices()
                },
                {
                    name: 'language',
                    description: 'Select a language',
                    type: DiscordApplicationCommandOptionTypeEnum.STRING,
                    required: false,
                    choices: this.#createLanguageChoices()
                }
            ]
        };
    }
}
