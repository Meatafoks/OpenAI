import { InlineConfig, MetafoksApplication } from '@metafoks/app';
import {
    ConfigWithOpenAI,
    openAIExtension,
    OpenAISpeechService,
    OpenAIThreadLoader,
    OpenAITranscriptionsService,
    OpenAIVisionService,
} from '../src';
import * as readline from 'readline';
import * as fs from 'fs';
import { OpenAIImageService } from '../src/services/openAIImageService';

@MetafoksApplication({
    with: [openAIExtension],
})
@InlineConfig<ConfigWithOpenAI>({
    openai: {
        organizationId: process.env.organization!,
        token: process.env.token!,
        vision: {
            maxTokens: 500,
            model: 'gpt-4-vision-preview',
        },
        speech: {
            model: 'tts-1',
            voice: 'nova',
        },
        transcriptions: {
            model: 'whisper-1',
        },
        image: {
            model: 'dall-e-2',
        },
    },
    metafoks: {
        logger: {
            level: {
                app: 'debug',
            },
        },
    },
})
class Application {
    io = readline.createInterface({ input: process.stdin, output: process.stdout });

    async prompt(message: string) {
        return new Promise<string>(resolve => {
            this.io.question(message, async value => {
                resolve(value);
            });
        });
    }

    constructor(
        private deps: {
            openAIThread: OpenAIThreadLoader;
            openAIVisionService: OpenAIVisionService;
            openAISpeechService: OpenAISpeechService;
            openAITranscriptionsService: OpenAITranscriptionsService;
            openAIImageService: OpenAIImageService;
        },
    ) {}

    public async start() {
        const value = await this.prompt(
            'type c - for chat, i - for image, s - for speech, t - for transcriptions, ig - for image generation, ie - for image editing: ',
        );
        switch (value) {
            case 'c':
                await this.testChat();
                break;
            case 'i':
                await this.testImage();
                break;
            case 's':
                await this.testSpeech();
                break;
            case 't':
                await this.testTranscriptions();
                break;
            case 'ig':
                await this.testImageGeneration();
                break;
            case 'ie':
                await this.testImageEdit();
                break;
        }
    }

    async testChat() {
        const { openAIThread } = this.deps;

        const thread = await openAIThread.create();
        thread.createUserMessage({ message: 'привет!' });

        const assistantTask = await thread.addAssistant({ assistantId: 'asst_bxBdoddoXiGp533zO8U7dMNn' });
        await assistantTask.waitForComplete();

        const message = await thread.getLastMessageInThread();
        console.log(message);
    }

    async testImage() {
        const { openAIVisionService } = this.deps;

        const url = await this.prompt('type image url: ');
        const processedUrl = url.trim();

        const result = await openAIVisionService.sendImageVisionRequest({
            imageUrl: processedUrl,
            text: 'что это?',
        });

        console.log(result);
    }

    async testImageGeneration() {
        const { openAIImageService } = this.deps;

        const text = await this.prompt('type prompt: ');

        const result = await openAIImageService.generateAndGetUrls({
            prompt: text.trim(),
        });

        console.log(result);
    }

    async testImageEdit() {
        const { openAIImageService } = this.deps;

        const result = await openAIImageService.editByLocalPathAndGetUrls('./__tests__/img.png', {
            prompt: 'дорисуй гитару полностью',
        });

        console.log(result);
    }
    async testSpeech() {
        const { openAISpeechService } = this.deps;

        const text = await this.prompt('type something to speech: ');

        const result = await openAISpeechService.createSpeechAsBuffer({
            text: text.trim(),
            format: 'opus',
        });

        fs.writeFileSync('./test.oga', result);
    }
    async testTranscriptions() {
        const { openAITranscriptionsService } = this.deps;

        const result = await openAITranscriptionsService.translateByLocalPath('./test.oga');
        console.log(result);
    }
}