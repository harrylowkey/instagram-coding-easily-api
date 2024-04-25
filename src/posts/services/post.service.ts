import { StorageService } from '~storage/services/storage.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreatePostInterface } from '~posts/interfaces/create-post.interface';
import { Code2ImageService, LanguageEnum, ThemeEnum, GenerateImagePramType } from '@harrylowkey/code2image';
import { CreateInstagramPostType } from '~posts/types/create-instagram-post.type';
import { OpenAIPostService } from './openai-post.service';
import { UploadPostService } from './upload-post.service';
import { HASHTAGS } from '~posts/constants/hashtag.constant';

@Injectable()
export class PostService implements CreatePostInterface {
    constructor(
        @Inject(forwardRef(() => OpenAIPostService))
        private openAIPostService: OpenAIPostService,
        private storageService: StorageService,
        private code2ImageService: Code2ImageService,
        private uploadPostService: UploadPostService
    ) {}

    get hashtags(): string {
        const pageHashtags = ['#codingeasily', '#coding_easily'];
        const hashtags = [...pageHashtags, ...HASHTAGS];

        return `${hashtags.join(' ')}`;
    }

    generateCaptionWithHashtags(language: LanguageEnum | undefined, caption: string = ''): string {
        const languageHashtag = language ? `#${language}` : '';
        return `${caption}\n${languageHashtag} ${this.hashtags}`;
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
        interactionId: string,
        interactionToken: string,
        code: string,
        language: LanguageEnum,
        caption?: string
    ): Promise<void> {
        const mediaUrls = await this.generatePostMedias(language, code);
        return this.uploadPostService.confirmUpload(interactionId, interactionToken, mediaUrls, caption);
    }

    async create(interactionId: string, interactionToken: string, params: CreateInstagramPostType = {}): Promise<void> {
        const { code, language, mediaUrls } = params;
        const caption = this.generateCaptionWithHashtags(language, params.caption);

        if (mediaUrls) {
            return this.uploadPostService.confirmUpload(interactionId, interactionToken, mediaUrls, caption);
        }

        if (code) {
            return this.createAndUploadPostWithCode(interactionId, interactionToken, code, language, caption);
        }

        return this.openAIPostService.create(interactionId, interactionToken, params);
    }
}
