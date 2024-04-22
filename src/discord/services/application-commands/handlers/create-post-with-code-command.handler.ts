import { Response } from 'express';
import { InteractionResponseType, MessageComponentTypes, TextStyleTypes } from 'discord-interactions';

import { ApplicationCommandInteractionHandlerInterface } from '~discord/interfaces/application-command-interaction-handler.interface';
import snakecaseKeys from 'snakecase-keys';
import { LanguageEnum } from '@harrylowkey/code2image';

export class CreatePostWithCodeCommandHandler implements ApplicationCommandInteractionHandlerInterface {
    constructor(private res: Response) {}

    response(): Response {
        return this.res.send(
            // TODO: add snakecaseKeys work in DiscordRequestResponseDataParser
            snakecaseKeys({
                type: InteractionResponseType.MODAL,
                data: {
                    title: 'Create post with code',
                    customId: 'create-post-with-code-modal',
                    components: [
                        {
                            customId: 'language',
                            type: MessageComponentTypes.ACTION_ROW,
                            components: [
                                {
                                    type: MessageComponentTypes.INPUT_TEXT,
                                    customId: 'language',
                                    label: 'Add language here',
                                    style: TextStyleTypes.SHORT,
                                    maxLength: 20,
                                    placeholder: `${Object.values(LanguageEnum).join(', ')}`,
                                    required: true
                                }
                            ]
                        },
                        {
                            customId: 'code',
                            type: MessageComponentTypes.ACTION_ROW,
                            components: [
                                {
                                    type: MessageComponentTypes.INPUT_TEXT,
                                    customId: 'code',
                                    label: 'Add code here',
                                    style: TextStyleTypes.PARAGRAPH,
                                    minLength: 1,
                                    maxLength: 4000,
                                    placeholder: 'console.log("Hello World!")',
                                    required: true
                                }
                            ]
                        },
                        {
                            customId: 'caption',
                            type: MessageComponentTypes.ACTION_ROW,
                            components: [
                                {
                                    type: MessageComponentTypes.INPUT_TEXT,
                                    customId: 'caption',
                                    label: 'Write a caption',
                                    style: TextStyleTypes.SHORT,
                                    maxLength: 255,
                                    placeholder: 'This is a sample code',
                                    required: false
                                }
                            ]
                        }
                    ]
                }
            })
        );
    }

    handle(): Response {
        return this.response();
    }
}
