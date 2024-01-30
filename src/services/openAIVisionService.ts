import { createLogger } from '@metafoks/app';
import { OpenAI } from '../loaders';
import {
    ChatCompletionContentPartText,
    ChatCompletionUserMessageParam,
    ChatCompletionContentPartImage,
} from 'openai/resources';
import { ConfigWithOpenAI } from '../config';

export interface ImageVisionRequest {
    imageUrl: string;
    text: string;
}

export class OpenAIVisionService {
    private logger = createLogger(OpenAIVisionService);

    constructor(private deps: { openai: OpenAI; config: ConfigWithOpenAI }) {}

    public async sendImageVisionRequest(props: ImageVisionRequest) {
        const { openai, config } = this.deps;

        if (!config.openai.vision) {
            throw new Error('config.openai.vision configuration is required!');
        }

        this.logger.debug(
            `sending vision request to model=${config.openai.vision.model} and tokens=${config.openai.vision.maxTokens}`,
        );
        this.logger.trace(props);

        const result = await openai.chat.completions.create(
            {
                model: config.openai.vision.model,
                stream: false,
                max_tokens: config.openai.vision.maxTokens,
                messages: createVisionRequestMessages(props),
            },
            { stream: false },
        );

        return result?.choices?.[0]?.message;
    }
}

export function createVisionRequestMessages(props: {
    imageUrl: string;
    text: string;
}): ChatCompletionUserMessageParam[] {
    return [
        {
            role: 'user',
            content: [createTextMessage(props.text), createImageUrlMessage(props.imageUrl)],
        },
    ];
}

export function createImageUrlMessage(url: string): ChatCompletionContentPartImage {
    return {
        type: 'image_url',
        image_url: { url },
    };
}
export function createTextMessage(text: string): ChatCompletionContentPartText {
    return { type: 'text', text };
}
