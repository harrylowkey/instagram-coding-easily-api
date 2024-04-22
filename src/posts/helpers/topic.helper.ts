import { PostTopicEnum } from '~posts/enums/post-topic.enum';

export function randomTopic(): PostTopicEnum {
    const topicsLength = Object.keys(PostTopicEnum).length;
    const randomIndex = Math.floor(Math.random() * topicsLength);
    return Object.values(PostTopicEnum)[randomIndex];
}
