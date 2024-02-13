import { ExtensionFactory } from '@metafoks/app';
import OpenaiLoader from './loaders/openai.loader';
import OpenAIThreadLoader from './loaders/openAIThread.loader';
import { OpenAIVisionService, OpenAISpeechService, OpenAITranscriptionsService } from './services';
import { OpenAIImageService } from './services/openAIImageService';

export const openAIExtension = ExtensionFactory.create({
    manifest: { identifier: 'org.metafoks.extension.OpenAI' },
    install: context => {
        context.addFunction('openai', OpenaiLoader);
        context.addFunction('openAIThread', OpenAIThreadLoader);

        context.addClass('openAIVisionService', OpenAIVisionService);
        context.addClass('openAISpeechService', OpenAISpeechService);
        context.addClass('openAITranscriptionsService', OpenAITranscriptionsService);
        context.addClass('openAIImageService', OpenAIImageService);
    },
});
