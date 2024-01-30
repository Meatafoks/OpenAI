export interface OpenAIVisionConfig {
    model: string;
    maxTokens: number;
}

export interface OpenAISpeechConfig {
    model: string;
    voice: string;
}

export interface OpenAITranscriptionsConfig {
    model: string;
}
export interface OpenAIImageConfig {
    model: string;
}

export interface OpenAIConfig {
    token: string;
    organizationId: string;

    vision?: OpenAIVisionConfig;
    speech?: OpenAISpeechConfig;
    transcriptions?: OpenAITranscriptionsConfig;
    image?: OpenAIImageConfig;
}

export interface ConfigWithOpenAI {
    openai: OpenAIConfig;
}
