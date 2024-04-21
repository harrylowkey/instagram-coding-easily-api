import { LanguageEnum } from '@harrylowkey/code2image';
import { InteractionResponseType } from 'discord-interactions';
import { Response } from 'express';
import { ApplicationCommandInteractionHandlerInterface } from '~discord/interfaces/appplication-command-interaction-handler.interface';
import { ApplicationCommandInteractionOptionType } from '~discord/types/discord-application-command-interaction-option.type';
import { DiscordInteractionDataType } from '~discord/types/discord-interaction-data.type';
import { PostTopicEnum } from '~posts/enums/post-topic.enum';
import { PostBuilderService } from '~posts/services/post-builder.service';
import { CreateInstagramPostType } from '~posts/types/create-instagram-post.type';

export class CreatePostCommandHandler implements ApplicationCommandInteractionHandlerInterface {
    constructor(
        private postBuilderService: PostBuilderService,
        private data: DiscordInteractionDataType,
        private res: Response
    ) {}

    #getTopic(options?: ApplicationCommandInteractionOptionType[]): PostTopicEnum {
        return options?.find(({ name }) => name === 'topic')?.value as PostTopicEnum;
    }

    #getLanguage(options?: ApplicationCommandInteractionOptionType[]): LanguageEnum {
        return options?.find(({ name }) => name === 'language')?.value as LanguageEnum;
    }

    #getImage(options?: ApplicationCommandInteractionOptionType[]): string {
        return options?.find(({ name }) => name === 'image')?.value as string;
    }

    #getCaption(options?: ApplicationCommandInteractionOptionType[]): string {
        return options?.find(({ name }) => name === 'caption')?.value as string;
    }

    #extractParams(): CreateInstagramPostType {
        const { options } = this.data;
        const image = this.#getImage(options);
        const caption = this.#getCaption(options);
        let topic = this.#getTopic(options);
        let language = this.#getLanguage(options);

        return { mediaUrls: [image], caption, topic, language };
    }

    #createPost(postTopic: PostTopicEnum, postLanguage: LanguageEnum): void {
        const topic = postTopic || this.postBuilderService.randomTopic();
        const language = postLanguage || this.postBuilderService.randomLanguage(topic);
        this.postBuilderService.create({ topic, language });
    }

    #uploadPost(postMediaUrls: string[], postCaption: string): void {
        this.postBuilderService.upload(postMediaUrls, postCaption);
    }

    #response(params: CreateInstagramPostType): Response {
        const { topic, language, mediaUrls, caption } = params;

        let content = 'Generating post...';
        if (mediaUrls && caption && (topic || language)) {
            content += '\n' + 'Topic and Language selected before will not be used to generate post';
        }

        return this.res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content }
        });
    }

    handle(): Response {
        const params = this.#extractParams();
        const { mediaUrls, caption, topic, language } = params;

        mediaUrls && caption ? this.#uploadPost(mediaUrls, caption) : this.#createPost(topic, language);
        return this.#response(params);
    }
}
