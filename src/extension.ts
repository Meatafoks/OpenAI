import { createExtension, MetafoksContext } from '@metafoks/app';
import OpenaiLoader from './loaders/openai.loader';
import OpenAIThreadLoader from './loaders/openAIThread.loader';
import { OpenAIVisionService, OpenAISpeechService, OpenAITranscriptionsService } from './services';
import { OpenAIImageService } from './services/openAIImageService';

export const openAIExtension = createExtension((context: MetafoksContext) => {
    context.addFunction('openai', OpenaiLoader);
    context.addFunction('openAIThread', OpenAIThreadLoader);

    context.addClass('openAIVisionService', OpenAIVisionService);
    context.addClass('openAISpeechService', OpenAISpeechService);
    context.addClass('openAITranscriptionsService', OpenAITranscriptionsService);
    context.addClass('openAIImageService', OpenAIImageService);

    return {
        identifier: 'ru.metafoks.extension.OpenAI',
    };
});
