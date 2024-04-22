import { InstagramGraphService } from '~instagram-graph/services/instagram-graph.service';
import { StorageService } from '~storage/services/storage.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreatePostInterface } from '~posts/interfaces/create-post.interface';
import { Code2ImageService, LanguageEnum, ThemeEnum, GenerateImagePramType } from '@harrylowkey/code2image';
import { CreateInstagramPostType } from '~posts/types/create-instagram-post.type';
import { OpenAIPostService } from './openai-post.service';
import { HASHTAGS } from '~posts/constants/hashtag.constant';

@Injectable()
export class PostService implements CreatePostInterface {
    constructor(
        @Inject(forwardRef(() => OpenAIPostService))
        private openAIPostService: OpenAIPostService,
        private instagramGraphService: InstagramGraphService,
        private storageService: StorageService,
        private code2ImageService: Code2ImageService
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

    async upload(imageUrls: string[], caption = ''): Promise<string> {
        caption = `${caption}\n${this.hashtags}`;

        const isSimplePost = imageUrls.length === 1;
        try {
            if (isSimplePost) {
                await this.instagramGraphService.uploadSimplePost({
                    imageUrl: imageUrls[0],
                    caption
                });
                return 'Successfully uploaded simple post';
            }

            await this.instagramGraphService.uploadCarouselPost({
                imageUrls,
                caption
            });
            return 'Successfully uploaded carousel post';
        } catch (error) {
            console.log('Failed to upload post', error.response);
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

    async createAndUploadPostWithCode(code: string, language: LanguageEnum, caption?: string): Promise<string> {
        const mediaUrls = await this.generatePostMedias(language, code);
        return this.upload(mediaUrls, caption);
    }

    async create(params: CreateInstagramPostType = {}): Promise<string> {
        const { code, language, caption, mediaUrls } = params;

        if (mediaUrls) {
            return this.upload(mediaUrls, caption);
        }

        if (code) {
            return this.createAndUploadPostWithCode(code, language, caption);
        }

        return this.openAIPostService.create(params);
    }
}
