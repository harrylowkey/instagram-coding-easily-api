import { LanguageEnum } from '@harrylowkey/code2image';
import { PostTopicEnum } from '~posts/enums/post-topic.enum';
import { CreateInstagramPostType } from '~posts/types/create-instagram-post.type';

export interface PostBuilderInterface {
    upload(imageUrls: string[], caption: string): Promise<string>;
    create(params?: CreateInstagramPostType): Promise<string>;
    randomTopic(): PostTopicEnum;
    randomLanguage(topic: PostTopicEnum): LanguageEnum;
}
