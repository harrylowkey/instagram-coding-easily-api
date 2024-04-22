import { LanguageEnum } from '@harrylowkey/code2image';
import { DiscordApplicationCommandOptionTypeEnum } from '~discord/enums/discord-application-command-option-type.enum';
import { DiscordApplicationCommandTypeEnum } from '~discord/enums/discord-application-command-type.enum';
import { ApplicationCommandOptionChoiceType } from '~discord/types/discord-application-command-option-choice.type';
import { ApplicationCommandOptionType } from '~discord/types/discord-application-command-option.type';
import { DiscordCreateApplicationCommandType } from '~discord/types/discord-create-application-command.type';
import { PostTopicEnum } from '~posts/enums/post-topic.enum';

export class DiscordCommandService {
    static createTopicChoices(): ApplicationCommandOptionChoiceType[] {
        const topics = Object.values(PostTopicEnum);
        return topics.reduce((choices, topic) => [...choices, { name: topic, value: topic }], []);
    }

    static createLanguageChoices(): ApplicationCommandOptionChoiceType[] {
        const languages = Object.values(LanguageEnum);
        return languages.reduce((choices, language) => [...choices, { name: language, value: language }], []);
    }

    static #generateImageOptions(quantity = 5): ApplicationCommandOptionType[] {
        const imageOptions = [];
        for (let index = 1; index <= quantity; index++) {
            imageOptions.push({
                name: `image-${index}`,
                description: `Upload image ${index}`,
                type: DiscordApplicationCommandOptionTypeEnum.ATTACHMENT,
                required: index == 1
            });
        }

        return imageOptions;
    }

    static createPostWithImageCommand(): DiscordCreateApplicationCommandType {
        return {
            name: 'create-post-with-image',
            description: 'Upload image and create post',
            options: [
                ...this.#generateImageOptions(),
                {
                    name: 'caption',
                    description: 'Write a caption',
                    type: DiscordApplicationCommandOptionTypeEnum.STRING,
                    required: false
                }
            ]
        };
    }

    static createPostWithCodeCommand(): DiscordCreateApplicationCommandType {
        return {
            name: 'create-post-with-code',
            description: 'Add code to create post',
            type: DiscordApplicationCommandTypeEnum.CHAT_INPUT
        };
    }

    static generatePostCommand(): DiscordCreateApplicationCommandType {
        return {
            name: 'generate-post',
            description: 'Generate and upload post command',
            options: [
                {
                    name: 'topic',
                    description: 'Select a topic (Skip if having images and caption)',
                    type: DiscordApplicationCommandOptionTypeEnum.STRING,
                    required: false,
                    choices: this.createTopicChoices()
                },
                {
                    name: 'language',
                    description: 'Select a language (Skip if having images and caption)',
                    type: DiscordApplicationCommandOptionTypeEnum.STRING,
                    required: false,
                    choices: this.createLanguageChoices()
                }
            ]
        };
    }
}
