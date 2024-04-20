import { InstagramGraphService } from '~instagram-graph/services/instagram-graph.service';
import { OpenAIService } from '~openai/services/openai.service';
import { StorageService } from '~storage/services/storage.service';
import { PostTopicEnum } from '~posts/enums/post-topic.enum';
import { ChatCompletion, ChatCompletionMessageParam } from 'openai/resources';
import { HASHTAGS } from '~posts/constants/hashtag.constant';
import { Injectable } from '@nestjs/common';
import { DesignPatternCategoryEnum } from '~posts/enums/design-pattern-category.enum';
import { DESIGN_PATTERN_CATEGORIES } from '~posts/constants/design-pattern-category.constant';
import { PostBuilderInterface } from '~posts/interfaces/post-builder.interface';
import { Code2ImageService, LanguageEnum, ThemeEnum, GenerateImagePramType } from '@harrylowkey/code2image';

@Injectable()
export class PostBuilderService implements PostBuilderInterface {
    constructor(
        private openAIService: OpenAIService,
        private instagramGraphService: InstagramGraphService,
        private storageService: StorageService,
        private code2ImageService: Code2ImageService
    ) { }

    get promptInstruction(): string {
        return 'Add the short description lesser or equal about 20 characters of the topic in the header. Not any comment or other text';
    }

    async upload(imageUrls: string[], caption: string) {
        const isSimplePost = imageUrls.length === 1;

        if (isSimplePost) {
            await this.instagramGraphService.uploadSimplePost({ imageUrl: imageUrls[0], caption });
            return 'Successfully uploaded simple post';
        }

        await this.instagramGraphService.uploadCarouselPost({ imageUrls, caption });
        return 'Successfully uploaded carousel post';
    }

    #randomTopic(): PostTopicEnum {
        const topicsLength = Object.keys(PostTopicEnum).length;
        const randomIndex = Math.floor(Math.random() * topicsLength);
        return Object.values(PostTopicEnum)[randomIndex];
    }

    #randomLanguage(topic: PostTopicEnum): LanguageEnum {
        const frontendLanguages = ['vuejs', 'vue', 'reactjs', 'react', 'angularjs', 'angular'];
        const markupLanguages = ['html'];
        const stylingLanguages = ['css'];
        const languages = Object.values(LanguageEnum);

        if ([PostTopicEnum.DESIGN_PATTERN, PostTopicEnum.MICROSERVICE].indexOf(topic)) {
            const backendLanguages = languages.filter(
                (language) =>
                    !frontendLanguages.includes(language) &&
                    !markupLanguages.includes(language) &&
                    !stylingLanguages.includes(language)
            );

            return backendLanguages[Math.floor(Math.random() * languages.length)];
        }

        return languages[Math.floor(Math.random() * languages.length)];
    }

    #randomTheme(): ThemeEnum {
        const themes = Object.values(ThemeEnum);
        return themes[Math.floor(Math.random() * themes.length)];
    }

    #randomLevel(): string {
        const levels = ['simple', 'medium', 'complicated'];
        return levels[Math.floor(Math.random() * levels.length)];
    }

    #generatePromptDessignPattern(language: string, topic: PostTopicEnum) {
        if (topic != PostTopicEnum.DESIGN_PATTERN) {
            return;
        }
        const categoryKeys = Object.keys(DESIGN_PATTERN_CATEGORIES);

        const randomCategoryKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
        const randomCategoryValues = DESIGN_PATTERN_CATEGORIES[randomCategoryKey as DesignPatternCategoryEnum];

        const randomCategory = randomCategoryValues[Math.floor(Math.random() * randomCategoryValues.length)];

        const category = `${topic} - ${randomCategory} pattern`;

        return `Write the short sample ${this.#randomLevel()} code in ${language} about the topic ${category}. ${this.promptInstruction}`;
    }

    #generatePrompt(topic: PostTopicEnum, language: string): ChatCompletionMessageParam[] {
        let content: string = `Write the short sample code in ${language} about the ${topic} topic. ${this.promptInstruction}`;

        if (topic == PostTopicEnum.BAD_AND_GOOD_CODE) {
            content = `Write the short ${this.#randomLevel()} sample code in ${language} to compare the ${topic}.
					Mark the sample bad code with comment // Bad Practice and good code with comment // Good Practice.
					${this.promptInstruction}`;
        }

        if (topic == PostTopicEnum.DESIGN_PATTERN) {
            content = this.#generatePromptDessignPattern(language, topic);
        }

        return [
            {
                role: 'user',
                content: content
            }
        ];
    }

    #generatePostCaption(topic: PostTopicEnum, language: string) {
        const pageHashtags = ['#codingeasily', '#coding_easily'];
        const topicHashtag = topic.length > 1 ? `${topic.split(' ').join('')}` : topic;
        const hashtags = [...pageHashtags, `#${topicHashtag}`, `#${language}`, ...HASHTAGS];
        const caption = `${topic} in ${language}`;

        return `${caption} 
${hashtags.join(' ')}
		`;
    }

    #checkIfGenerateImagesFail(images: Buffer[] | undefined[]) {
        const validImages = images.filter((image) => image != undefined);
        if (!validImages.length) {
            throw new Error('Generate image from code fail');
        }
    }

    async #generatePostMedias(language: LanguageEnum, chatCompletion: ChatCompletion) {
        const params: GenerateImagePramType = {
            code: '',
            theme: this.#randomTheme(),
            language: language
        };

        const chatCompletionText = chatCompletion.choices[0].message.content;
        const codes = [chatCompletionText];
        const images = await Promise.all(
            codes.map((code) => this.code2ImageService.generateImage({ ...params, code }))
        );

        this.#checkIfGenerateImagesFail(images);
        return Promise.all(images.map((image) => this.storageService.uploadFile(image)));
    }

    async #generatePost(topic: PostTopicEnum, language: LanguageEnum, chatCompletion: ChatCompletion) {
        const mediaUrls = await this.#generatePostMedias(language, chatCompletion);
        const caption = this.#generatePostCaption(topic, language);

        return this.upload(mediaUrls, caption);
    }

    async generate() {
        const topic = this.#randomTopic();
        const language = this.#randomLanguage(topic);
        if (!topic || !language) {
            return this.generate();
        }

        const prompt = this.#generatePrompt(topic, language);
        const chatCompletion = await this.openAIService.createChat(prompt);

        return this.#generatePost(topic, language, chatCompletion);
    }
}
