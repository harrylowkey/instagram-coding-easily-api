import { LanguageEnum } from '@harrylowkey/code2image';
import { PostTopicEnum } from '~posts/enums/post-topic.enum';

export function randomLanguage(topic: PostTopicEnum): LanguageEnum {
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
