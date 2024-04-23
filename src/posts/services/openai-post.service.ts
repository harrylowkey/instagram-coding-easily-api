import { PostTopicEnum } from '~posts/enums/post-topic.enum';
import { ChatCompletionMessageParam } from 'openai/resources';
import { HASHTAGS } from '~posts/constants/hashtag.constant';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DesignPatternCategoryEnum } from '~posts/enums/design-pattern-category.enum';
import { DESIGN_PATTERN_CATEGORIES } from '~posts/constants/design-pattern-category.constant';
import { LanguageEnum } from '@harrylowkey/code2image';
import { CreateInstagramPostType } from '~posts/types/create-instagram-post.type';
import { PostService } from './post.service';
import { OpenAIService } from '~openai/services/openai.service';
import { CreateOpenAIPostInterface } from '~posts/interfaces/create-openapi-post.interface';
import { randomTopic } from '~posts/helpers/topic.helper';
import { randomLanguage } from '~posts/helpers/language.helper';
import { UploadPostService } from './upload-post.service';

@Injectable()
export class OpenAIPostService implements CreateOpenAIPostInterface {
    constructor(
        @Inject(forwardRef(() => PostService))
        private postService: PostService,
        private openAIService: OpenAIService,
        private uploadPostService: UploadPostService
    ) {}

    get promptInstruction(): string {
        return 'Add the short description lesser or equal about 20 characters of the topic in the header. Not any comment or other text';
    }

    randomLevel(): string {
        const levels = ['simple', 'medium', 'complicated'];
        return levels[Math.floor(Math.random() * levels.length)];
    }

    generatePromptDessignPattern(language: string, topic: PostTopicEnum): string {
        const categoryKeys = Object.keys(DESIGN_PATTERN_CATEGORIES);

        const randomCategoryKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
        const randomCategoryValues = DESIGN_PATTERN_CATEGORIES[randomCategoryKey as DesignPatternCategoryEnum];

        const randomCategory = randomCategoryValues[Math.floor(Math.random() * randomCategoryValues.length)];
        const category = `${topic} - ${randomCategory} pattern`;

        return `Write the short sample ${this.randomLevel()} code in ${language} about the topic ${category}. ${this.promptInstruction}`;
    }

    generatePrompt(topic: PostTopicEnum, language: string): ChatCompletionMessageParam[] {
        let content: string = `Write the short sample code in ${language} about the ${topic} topic. ${this.promptInstruction}`;

        if (topic == PostTopicEnum.BAD_AND_GOOD_CODE) {
            content = `Write the short ${this.randomLevel()} sample code in ${language} to compare the ${topic}.
					Mark the sample bad code with comment // Bad Practice and good code with comment // Good Practice.
					${this.promptInstruction}`;
        }

        if (topic == PostTopicEnum.DESIGN_PATTERN) {
            content = this.generatePromptDessignPattern(language, topic);
        }

        return [
            {
                role: 'user',
                content: content
            }
        ];
    }

    generatePostCaption(topic: PostTopicEnum, language: string): string {
        const pageHashtags = ['#codingeasily', '#coding_easily'];
        const topicHashtag = topic.length > 1 ? `${topic.split(' ').join('')}` : topic;
        const hashtags = [...pageHashtags, `#${topicHashtag}`, `#${language}`, ...HASHTAGS];
        const caption = `${topic} in ${language}`;

        return `${caption} \n${hashtags.join(' ')}`;
    }

    async generateCode(topic: PostTopicEnum, language: LanguageEnum): Promise<string> {
        const prompt = this.generatePrompt(topic, language);
        const chatCompletion = await this.openAIService.createChat(prompt);
        return chatCompletion.choices[0].message.content;
    }

    async preparePost(params: CreateInstagramPostType): Promise<Partial<CreateInstagramPostType>> {
        const { topic: postTopic, language: postLanguage, caption: postCaption } = params;

        const topic = postTopic || randomTopic();
        const language = postLanguage || randomLanguage(topic);

        if (!topic || !language) {
            return this.preparePost(params);
        }

        const code = await this.generateCode(topic, language);
        const mediaUrls = await this.postService.generatePostMedias(language, code);
        const caption = postCaption || this.generatePostCaption(topic, language);

        return { mediaUrls, caption };
    }

    async create(interactionId: string, interactionToken: string, params: CreateInstagramPostType): Promise<void> {
        const { mediaUrls, caption } = await this.preparePost(params);
        return this.uploadPostService.confirmUpload(interactionId, interactionToken, mediaUrls, caption);
    }
}
