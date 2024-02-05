import { OpenAITiktokenUtils } from '../src/utils';

describe('tiktoken tests', () => {
    it('should correctly counts for gpt-3.5', () => {
        // given
        const ruString = 'Привет, Мир!';
        const ruTokens = 7;

        const enString = 'Hello, world!';
        const enTokens = 4;

        const model = OpenAITiktokenUtils.getTiktokenModel('gpt-3.5-turbo');

        // when
        const ruResult = model.encode(ruString);
        const enResult = model.encode(enString);
        model.free();

        // then
        expect(ruResult.length).toEqual(ruTokens);
        expect(enResult.length).toEqual(enTokens);
    });

    it('should correctly counts for gpt-4', () => {
        // given
        const ruString = 'Привет, Мир!';
        const ruTokens = 7;

        const enString = 'Hello, world!';
        const enTokens = 4;

        const model = OpenAITiktokenUtils.getTiktokenModel('gpt-4');

        // when
        const ruResult = model.encode(ruString);
        const enResult = model.encode(enString);
        model.free();

        // then
        expect(ruResult.length).toEqual(ruTokens);
        expect(enResult.length).toEqual(enTokens);
    });
});
