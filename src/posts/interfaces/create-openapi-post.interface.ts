import { CreateInstagramPostType } from '~posts/types/create-instagram-post.type';

export interface CreateOpenAIPostInterface {
    create(interactionId: string, interactionToken: string, params: CreateInstagramPostType): Promise<void>;
}
