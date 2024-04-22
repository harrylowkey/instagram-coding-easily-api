import { LanguageEnum } from '@harrylowkey/code2image';
import { CreateInstagramPostType } from '~posts/types/create-instagram-post.type';

export interface CreatePostInterface {
    upload(interactionToken: string, imageUrls: string[], caption: string): Promise<void>;
    create(interactionToken: string, params: CreateInstagramPostType): Promise<void>;
    generatePostMedias(language: LanguageEnum, code: string): Promise<string[]>;
}
