import OpenAI from 'openai';
import { env } from '~config/env.config';
import { APIPromise } from 'openai/core';
import { ChatCompletion, ChatCompletionMessageParam } from 'openai/resources';

export class OpenAIService {
    private readonly openAI: OpenAI;

    constructor() {
        this.openAI = new OpenAI({
            baseURL: 'https://api.openai.com/v1',
            apiKey: env.OPENAPI_API_KEY
        });
    }

    createChat(messages: ChatCompletionMessageParam[]): APIPromise<ChatCompletion> {
        const instruction: ChatCompletionMessageParam = {
            role: 'system',
            content: 'You are a senior, master, tech lead at big tech company'
        };

        return this.openAI.chat.completions.create({
            messages: [instruction, ...messages],
            model: 'gpt-3.5-turbo'
        });
    }
}
