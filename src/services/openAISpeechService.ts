import { createLogger } from '@metafoks/app';
import { OpenAI } from '../loaders';
import { ConfigWithOpenAI } from '../config';

export interface GetSpeechProps {
    text: string;
    format?: 'mp3' | 'opus' | 'aac' | 'flac';
    speed?: number;
}

export class OpenAISpeechService {
    private logger = createLogger(OpenAISpeechService);

    constructor(private deps: { openai: OpenAI; config: ConfigWithOpenAI }) {}

    public async createSpeech(props: GetSpeechProps) {
        const { openai, config } = this.deps;

        if (!config.openai.speech) {
            throw new Error('config.openai.speech configuration required!');
        }

        this.logger.debug(`sending speech generation request, tokens length=${props.text.length}`);
        const result = await openai.audio.speech.create({
            model: config.openai.speech.model,
            voice: config.openai.speech.voice as any,
            input: props.text,
            speed: props.speed,
            response_format: props.format,
        });

        this.logger.info(`received speech from openai with status=${result.status}`);
        return result;
    }

    /**
     * Creates the speech and converts it to array buffer
     * @param props
     */
    public async createSpeechAsArrayBuffer(props: GetSpeechProps) {
        const result = await this.createSpeech(props);
        return await result.arrayBuffer();
    }

    /**
     * Creates the speech and converts it to buffer
     * @param props
     */
    public async createSpeechAsBuffer(props: GetSpeechProps) {
        const result = await this.createSpeechAsArrayBuffer(props);
        return Buffer.from(result);
    }
}
