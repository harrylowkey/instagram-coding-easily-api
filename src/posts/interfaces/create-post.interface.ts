import { LanguageEnum } from '@harrylowkey/code2image';
import { CreateInstagramPostType } from '~posts/types/create-instagram-post.type';

export interface CreatePostInterface {
    create(interactionId: string, interactionToken: string, params: CreateInstagramPostType): Promise<void>;
    generatePostMedias(language: LanguageEnum, code: string): Promise<string[]>;
}
