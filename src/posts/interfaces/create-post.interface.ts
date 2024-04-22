import { LanguageEnum } from '@harrylowkey/code2image';
import { CreateInstagramPostType } from '~posts/types/create-instagram-post.type';

export interface CreatePostInterface {
    upload(imageUrls: string[], caption: string): Promise<string>;
    create(params?: CreateInstagramPostType): Promise<string>;
    generatePostMedias(language: LanguageEnum, code: string): Promise<string[]>;
}
