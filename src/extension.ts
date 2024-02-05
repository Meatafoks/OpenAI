import { createExtension, LoggerFactory, MetafoksContext } from '@metafoks/app';
import OpenaiLoader from './loaders/openai.loader';
import OpenAIThreadLoader from './loaders/openAIThread.loader';
import { OpenAIVisionService, OpenAISpeechService, OpenAITranscriptionsService } from './services';
import { OpenAIImageService } from './services/openAIImageService';

export const openAIExtension = createExtension((context: MetafoksContext) => {
    const logger = LoggerFactory.createLoggerByName('OpenAIExtension');
    logger.level = context.getConfig().metafoks?.logger?.level?.app ?? 'INFO';
    logger.debug('start registration extension');

    context.addFunction('openai', OpenaiLoader);
    context.addFunction('openAIThread', OpenAIThreadLoader);

    context.addClass('openAIVisionService', OpenAIVisionService);
    context.addClass('openAISpeechService', OpenAISpeechService);
    context.addClass('openAITranscriptionsService', OpenAITranscriptionsService);
    context.addClass('openAIImageService', OpenAIImageService);

    logger.info('extension registered');

    return {
        identifier: 'ru.metafoks.extension.OpenAI',
    };
});
