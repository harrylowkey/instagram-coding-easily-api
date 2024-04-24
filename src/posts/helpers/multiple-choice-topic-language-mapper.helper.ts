import { LanguageEnum } from '@harrylowkey/code2image';
import {
    CPPTopicsEnum,
    CSSTopicsEnum,
    CTopicsEnum,
    GoTopicsEnum,
    HTMLTopicsEnum,
    JavaScriptTopicsEnum,
    JavaTopicsEnum,
    JSXTopicsEnum,
    PHPTopicsEnum,
    PythonTopicsEnum,
    RustTopicsEnum,
    TypeScriptTopicsEnum
} from '~posts/enums/multiple-choice-language-topic.enum';

interface LanguageTopics {
    [key: string]: string[];
}

export const MULTIPLE_CHOICE_LANGUAGE_TOPIC_MAPPER: LanguageTopics = {
    [LanguageEnum.C]: Object.values(CTopicsEnum),
    [LanguageEnum.CSS]: Object.values(CSSTopicsEnum),
    [LanguageEnum.CPP]: Object.values(CPPTopicsEnum),
    [LanguageEnum.Go]: Object.values(GoTopicsEnum),
    [LanguageEnum.HTML]: Object.values(HTMLTopicsEnum),
    [LanguageEnum.Java]: Object.values(JavaTopicsEnum),
    [LanguageEnum.JavaScript]: Object.values(JavaScriptTopicsEnum),
    [LanguageEnum.JSX]: Object.values(JSXTopicsEnum),
    [LanguageEnum.PHP]: Object.values(PHPTopicsEnum),
    [LanguageEnum.Python]: Object.values(PythonTopicsEnum),
    [LanguageEnum.Rust]: Object.values(RustTopicsEnum),
    [LanguageEnum.TypeScript]: Object.values(TypeScriptTopicsEnum)
};
