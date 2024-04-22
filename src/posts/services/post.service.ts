import { InstagramGraphService } from '~instagram-graph/services/instagram-graph.service';
import { StorageService } from '~storage/services/storage.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreatePostInterface } from '~posts/interfaces/create-post.interface';
import { Code2ImageService, LanguageEnum, ThemeEnum, GenerateImagePramType } from '@harrylowkey/code2image';
import { CreateInstagramPostType } from '~posts/types/create-instagram-post.type';
import { OpenAIPostService } from './openai-post.service';
import { HASHTAGS } from '~posts/constants/hashtag.constant';
import { DiscordClientService } from '~discord/services/discord-client.service';

@Injectable()
export class PostService implements CreatePostInterface {
    constructor(
        @Inject(forwardRef(() => OpenAIPostService))
        private openAIPostService: OpenAIPostService,
        private instagramGraphService: InstagramGraphService,
        private storageService: StorageService,
        private code2ImageService: Code2ImageService,
        private discordClientService: DiscordClientService
    ) {}

    get hashtags(): string {
        const pageHashtags = ['#codingeasily', '#coding_easily'];
        const hashtags = [...pageHashtags, ...HASHTAGS];

        return `${hashtags.join(' ')}`;
    }

    randomTheme(): ThemeEnum {
        const themes = Object.values(ThemeEnum);
        return themes[Math.floor(Math.random() * themes.length)];
    }

    checkIfGenerateImagesFail(images: Buffer[] | undefined[]): void {
        const validImages = images.filter((image) => image != undefined);
        if (!validImages.length) {
            throw new Error('Generate image from code fail');
        }
    }

    async createInteractionResponse(interactionToken: string, content: string): Promise<void> {
        await this.discordClientService.createFollowupMessage(interactionToken, {
            content
        });
    }

    async upload(interactionToken: string, imageUrls: string[], caption = ''): Promise<void> {
        caption = `${caption}\n${this.hashtags}`;

        const isSimplePost = imageUrls.length === 1;
        try {
            let message = 'Successfully uploaded post';
            if (isSimplePost) {
                await this.instagramGraphService.uploadSimplePost({
                    imageUrl: imageUrls[0],
                    caption
                });
                message = 'Successfully uploaded simple post';
            } else {
                await this.instagramGraphService.uploadCarouselPost({
                    imageUrls,
                    caption
                });
                message = 'Successfully uploaded carousel post';
            }

            await this.createInteractionResponse(interactionToken, message);
        } catch (error) {
            console.log('Failed to upload post', error.response);
            await this.createInteractionResponse(interactionToken, `Failed to upload post: ${error.response}`);
        }
    }

    async generatePostMedias(language: LanguageEnum, code: string): Promise<string[]> {
        const params: GenerateImagePramType = {
            code: '',
            theme: this.randomTheme(),
            language: language
        };

        const codes = [code];
        const images = await Promise.all(
            codes.map((code) => this.code2ImageService.generateImage({ ...params, code }))
        );

        this.checkIfGenerateImagesFail(images);
        return Promise.all(images.map((image) => this.storageService.uploadFile(image)));
    }

    async createAndUploadPostWithCode(
        interactionToken: string,
        code: string,
        language: LanguageEnum,
        caption?: string
    ): Promise<void> {
        const mediaUrls = await this.generatePostMedias(language, code);
        return this.upload(interactionToken, mediaUrls, caption);
    }

    async create(interactionToken: string, params: CreateInstagramPostType = {}): Promise<void> {
        const { code, language, caption, mediaUrls } = params;

        if (mediaUrls) {
            return this.upload(interactionToken, mediaUrls, caption);
        }

        if (code) {
            return this.createAndUploadPostWithCode(interactionToken, code, language, caption);
        }

        return this.openAIPostService.create(interactionToken, params);
    }
}
