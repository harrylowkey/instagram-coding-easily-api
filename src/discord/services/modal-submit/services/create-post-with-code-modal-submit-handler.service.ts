/* eslint-disable @typescript-eslint/naming-convention */
import { Response } from 'express';
import { InteractionResponseType } from 'discord-interactions';

import { ModelSubmitInteractionInterface } from '~discord/interfaces/modal-submit-interaction-handler.interface';
import { DiscordModalSubmitDataType, ModalSubmitComponentType } from '~discord/types/discord-modal-submit-data.type';
import { LanguageEnum } from '@harrylowkey/code2image';
import { PostService } from '~posts/services/post.service';

export class CreatePostWithCodeModalSubmitHandler implements ModelSubmitInteractionInterface {
    constructor(
        private postService: PostService,
        private data: DiscordModalSubmitDataType,
        private res: Response
    ) {}

    #extractPostParams(components: ModalSubmitComponentType[]): LanguageEnum[] {
        const componentsOrder = ['language', 'code', 'caption'];

        return components.reduce(
            (acc, component, index) => [
                ...acc,
                component.components.find(({ custom_id }) => custom_id == componentsOrder[index])?.value
            ],
            []
        );
    }

    #validateLanguage(language: LanguageEnum): Response {
        if (!Object.values(LanguageEnum).includes(language)) {
            return this.response(`Invalid or not support **${language}** language yet`);
        }
    }

    response(content = 'Generating post...'): Response {
        return this.res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content }
        });
    }

    handle(): Response {
        const { components } = this.data;
        const [language, code, caption] = this.#extractPostParams(components);
        this.#validateLanguage(language as unknown as LanguageEnum);

        this.postService.create({ language, code, caption });
        return this.response();
    }
}
