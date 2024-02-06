export const defaultAppConfig = {
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
    logger: {
        level: {
            app: 'debug',
        },
    },
};
