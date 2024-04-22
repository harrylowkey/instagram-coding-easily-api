import { LanguageEnum } from '@harrylowkey/code2image';
import { InteractionResponseType } from 'discord-interactions';
import { Response } from 'express';
import { ApplicationCommandInteractionHandlerInterface } from '~discord/interfaces/application-command-interaction-handler.interface';
import { ApplicationCommandInteractionOptionType } from '~discord/types/discord-application-command-interaction-option.type';
import { ApplicationCommandDataType } from '~discord/types/discord-application-command-data.type';
import { PostTopicEnum } from '~posts/enums/post-topic.enum';
import { CreateInstagramPostType } from '~posts/types/create-instagram-post.type';
import { PostService } from '~posts/services/post.service';
import { DiscordInteractionType } from '~discord/types/discord-interaction.type';

export class GeneratePostCommandHandler implements ApplicationCommandInteractionHandlerInterface {
    constructor(
        private postService: PostService,
        private dto: DiscordInteractionType,
        private res: Response
    ) {}

    #getTopic(options?: ApplicationCommandInteractionOptionType[]): PostTopicEnum {
        return options?.find(({ name }) => name === 'topic')?.value as PostTopicEnum;
    }

    #getLanguage(options?: ApplicationCommandInteractionOptionType[]): LanguageEnum {
        return options?.find(({ name }) => name === 'language')?.value as LanguageEnum;
    }

    #extractParams(): CreateInstagramPostType {
        const { options } = this.dto.data as ApplicationCommandDataType;
        let topic = this.#getTopic(options);
        let language = this.#getLanguage(options);

        return { topic, language };
    }

    #createPost(topic: PostTopicEnum, language: LanguageEnum): void {
        const { token } = this.dto;
        this.postService.create(token, { topic, language });
    }

    response(): Response {
        return this.res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: 'Generating post...' }
        });
    }

    handle(): Response {
        const params = this.#extractParams();
        const { topic, language } = params;

        this.#createPost(topic, language);

        return this.response();
    }
}
