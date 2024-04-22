import { CreateInstagramPostType } from '~posts/types/create-instagram-post.type';

export interface CreateOpenAIPostInterface {
    create(interactionToken: string, params: CreateInstagramPostType): Promise<void>;
}
