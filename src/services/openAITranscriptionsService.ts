import { createLogger } from '@metafoks/app';
import { OpenAI } from '../loaders';
import { toFile } from 'openai';
import type { Uploadable } from 'openai/src/core';
import { ConfigWithOpenAI } from '../config';
import * as fs from 'fs';
import { TranscriptionResult } from '../dto';
import { createFileByLocalPath, createFileByUrl } from '../utils';

export interface TranslateProps {
    file: Uploadable;
    language?: string;
    format?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
    prompt?: string;
    temperature?: number;
}

export class OpenAITranscriptionsService {
    private logger = createLogger(OpenAITranscriptionsService);

    constructor(private deps: { openai: OpenAI; config: ConfigWithOpenAI }) {}

    public async transcript(props: TranslateProps): Promise<TranscriptionResult> {
        const { config, openai } = this.deps;

        if (!config.openai.transcriptions) {
            throw new Error('config.openai.transcriptions configuration required!');
        }

        this.logger.debug('sending transcriptions request');
        const result = await openai.audio.transcriptions.create({
            file: props.file,
            model: config.openai.transcriptions.model,
            language: props.language,
            response_format: props.format,
            temperature: props.temperature,
        });

        this.logger.info(`received transcriptions from openai length=${result.text.length}`);
        return result;
    }

    public async transcriptByUrl(url: string, options: Omit<TranslateProps, 'file'> = {}) {
        return this.transcript({
            ...options,
            file: await createFileByUrl(url),
        });
    }

    public async transcriptByLocalPath(path: string, options: Omit<TranslateProps, 'file'> = {}) {
        return this.transcript({
            ...options,
            file: await createFileByLocalPath(path),
        });
    }
}
