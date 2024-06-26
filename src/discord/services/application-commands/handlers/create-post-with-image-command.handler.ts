import { InteractionResponseType } from 'discord-interactions';
import { Response } from 'express';
import { ApplicationCommandInteractionHandlerInterface } from '~discord/interfaces/application-command-interaction-handler.interface';
import { ApplicationCommandInteractionOptionType } from '~discord/types/discord-application-command-interaction-option.type';
import { ApplicationCommandDataType } from '~discord/types/discord-application-command-data.type';
import { DiscordResolvedDataType } from '~discord/types/discord-resolved-data.type';
import { CreateInstagramPostType } from '~posts/types/create-instagram-post.type';
import { PostService } from '~posts/services/post.service';
import { DiscordInteractionType } from '~discord/types/discord-interaction.type';

export class CreatePostWithImageCommandHandler implements ApplicationCommandInteractionHandlerInterface {
    constructor(
        private postService: PostService,
        private dto: DiscordInteractionType,
        private res: Response
    ) {}

    #getImageUrls(options: ApplicationCommandInteractionOptionType[], resolved: DiscordResolvedDataType): string[] {
        return options
            .filter(({ name }, index) => name === `image-${index + 1}`)
            .map(({ value }) => resolved.attachments[value].url);
    }

    #getCaption(options?: ApplicationCommandInteractionOptionType[]): string {
        return options?.find(({ name }) => name === 'caption')?.value as string;
    }

    #extractParams(): CreateInstagramPostType {
        const { options, resolved } = this.dto.data as ApplicationCommandDataType;
        const imageUrls = this.#getImageUrls(options, resolved);
        const caption = this.#getCaption(options);

        return { mediaUrls: imageUrls, caption };
    }

    #uploadPost(mediaUrls: string[], caption: string): void {
        const { id, token } = this.dto;
        this.postService.create(id, token, { mediaUrls, caption });
    }

    response(): Response {
        let content = ':hourglass: Preparing post...';
        return this.res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content }
        });
    }

    handle(): Response {
        const params = this.#extractParams();
        const { mediaUrls, caption } = params;

        this.#uploadPost(mediaUrls, caption);
        return this.response();
    }
}
