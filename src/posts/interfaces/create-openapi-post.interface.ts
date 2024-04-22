import { CreateInstagramPostType } from '~posts/types/create-instagram-post.type';

export interface CreateOpenAIPostInterface {
    create(params?: CreateInstagramPostType): Promise<string>;
}
