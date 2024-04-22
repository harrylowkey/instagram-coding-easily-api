import { LanguageEnum } from '@harrylowkey/code2image';
import { PostTopicEnum } from '~posts/enums/post-topic.enum';

export type CreateInstagramPostType = {
    topic?: PostTopicEnum;
    language?: LanguageEnum;
    mediaUrls?: string[];
    caption?: string;
    code?: string;
};
