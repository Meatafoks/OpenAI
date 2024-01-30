import { createLogger } from '@metafoks/app';
import { OpenAI } from '../loaders';
import { ConfigWithOpenAI } from '../config';
import { Uploadable } from 'openai/src/core';
import { createFileByLocalPath, createFileByUrl } from '../utils';

export interface GenerationProps {
    prompt: string;
    model?: string;
    count?: number;
    format?: 'url' | 'b64_json' | null;
    quality?: 'standard' | 'hd';
    size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | null;
    user?: string;
}

export interface EditProps extends Omit<GenerationProps, 'quality'> {
    file: Uploadable;
    size?: '256x256' | '512x512' | '1024x1024' | null;
}

export class OpenAIImageService {
    private logger = createLogger(OpenAIImageService);

    constructor(private deps: { openai: OpenAI; config: ConfigWithOpenAI }) {}

    public async generate(props: GenerationProps) {
        const { openai, config } = this.deps;

        if (!config.openai.image) {
            throw new Error('config.openai.image configuration is required!');
        }

        const model = props.model ?? config.openai.image.model;

        this.logger.debug(`sending generation request, prompt length=${props.prompt.length}`);
        const result = await openai.images.generate({
            model,
            prompt: props.prompt,
            n: props.count,
            quality: props.quality,
            size: props.size,
            response_format: props.format,
            user: props.user,
        });

        this.logger.info('received image from openai');
        return result.data;
    }

    public async edit(props: EditProps) {
        const { openai, config } = this.deps;

        if (!config.openai.image) {
            throw new Error('config.openai.image configuration is required!');
        }

        const model = props.model ?? config.openai.image.model;

        this.logger.debug(`sending edit request, prompt length=${props.prompt.length}`);
        const result = await openai.images.edit({
            image: props.file,
            model,
            prompt: props.prompt,
            n: props.count,
            size: props.size,
            response_format: props.format,
            user: props.user,
        });

        this.logger.info('received edited image from openai');
        return result.data;
    }

    public async editByUrl(url: string, options: Omit<EditProps, 'file'>) {
        return this.edit({
            ...options,
            file: await createFileByUrl(url),
        });
    }

    public async editByLocalPath(path: string, options: Omit<EditProps, 'file'>) {
        return this.edit({
            ...options,
            file: await createFileByLocalPath(path),
        });
    }

    public async editByUrlAndGetUrls(url: string, options: Omit<EditProps, 'file' | 'format'>) {
        return (await this.edit({
            ...options,
            format: 'url',
            file: await createFileByUrl(url),
        })) as Array<{ url: string }>;
    }

    public async editByLocalPathAndGetUrls(path: string, options: Omit<EditProps, 'file' | 'format'>) {
        return (await this.edit({
            ...options,
            format: 'url',
            file: await createFileByLocalPath(path),
        })) as Array<{ url: string }>;
    }

    public async editByUrlAndGetBase64(url: string, options: Omit<EditProps, 'file' | 'format'>) {
        return (await this.edit({
            ...options,
            format: 'b64_json',
            file: await createFileByUrl(url),
        })) as Array<{ b64_json: string }>;
    }

    public async editByLocalPathAndGetBase64(path: string, options: Omit<EditProps, 'file' | 'format'>) {
        return (await this.edit({
            ...options,
            format: 'b64_json',
            file: await createFileByLocalPath(path),
        })) as Array<{ b64_json: string }>;
    }

    public async generateAndGetUrls(props: Omit<GenerationProps, 'format'>) {
        return (await this.generate({ ...props, format: 'url' })) as Array<{ url: string }>;
    }

    public async generateAndGetBase64(props: Omit<GenerationProps, 'format'>) {
        return (await this.generate({ ...props, format: 'b64_json' })) as Array<{ b64_json: string }>;
    }
}
