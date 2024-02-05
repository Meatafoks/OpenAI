import { encoding_for_model, get_encoding, Tiktoken } from 'tiktoken';

export type EncodingTypes = 'gpt2' | 'r50k_base' | 'p50k_base' | 'p50k_edit' | 'cl100k_base';

export type TiktokenModel =
    | 'davinci-002'
    | 'babbage-002'
    | 'text-davinci-003'
    | 'text-davinci-002'
    | 'text-davinci-001'
    | 'text-curie-001'
    | 'text-babbage-001'
    | 'text-ada-001'
    | 'davinci'
    | 'curie'
    | 'babbage'
    | 'ada'
    | 'code-davinci-002'
    | 'code-davinci-001'
    | 'code-cushman-002'
    | 'code-cushman-001'
    | 'davinci-codex'
    | 'cushman-codex'
    | 'text-davinci-edit-001'
    | 'code-davinci-edit-001'
    | 'text-embedding-ada-002'
    | 'text-similarity-davinci-001'
    | 'text-similarity-curie-001'
    | 'text-similarity-babbage-001'
    | 'text-similarity-ada-001'
    | 'text-search-davinci-doc-001'
    | 'text-search-curie-doc-001'
    | 'text-search-babbage-doc-001'
    | 'text-search-ada-doc-001'
    | 'code-search-babbage-code-001'
    | 'code-search-ada-code-001'
    | 'gpt2'
    | 'gpt-3.5-turbo'
    | 'gpt-35-turbo'
    | 'gpt-3.5-turbo-0301'
    | 'gpt-3.5-turbo-0613'
    | 'gpt-3.5-turbo-1106'
    | 'gpt-3.5-turbo-0125'
    | 'gpt-3.5-turbo-16k'
    | 'gpt-3.5-turbo-16k-0613'
    | 'gpt-3.5-turbo-instruct'
    | 'gpt-3.5-turbo-instruct-0914'
    | 'gpt-4'
    | 'gpt-4-0314'
    | 'gpt-4-0613'
    | 'gpt-4-32k'
    | 'gpt-4-32k-0314'
    | 'gpt-4-32k-0613'
    | 'gpt-4-turbo-preview'
    | 'gpt-4-1106-preview'
    | 'gpt-4-0125-preview'
    | 'gpt-4-vision-preview';

/**
 * Tiktoken utils
 */
export class OpenAITiktokenUtils {
    private static tiktokenInstances: Partial<Record<TiktokenModel, Tiktoken>> = {};

    /**
     * Returns the tiktoken model instance
     * @param model
     */
    public static getTiktokenModel(model: TiktokenModel) {
        if (!this.tiktokenInstances[model]) {
            this.tiktokenInstances[model] = this.createTiktokenForModel(model);
        }
        return this.tiktokenInstances[model]!;
    }

    private static createTiktokenForModel(model: TiktokenModel) {
        return encoding_for_model(model);
    }

    public static createTiktokenEncoder(model: EncodingTypes) {
        return get_encoding(model);
    }

    public static getTokens(model: TiktokenModel, source: string) {
        return this.getTiktokenModel(model).encode(source);
    }
}
