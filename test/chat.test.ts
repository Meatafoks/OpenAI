import { defaultAppConfig } from './defaultAppConfig';
import { openAIExtension, OpenAIThreadLoader } from '../src';
import { MetafoksAbstractContext } from '@metafoks/app/lib/testing/metafoksAbstractContext';
import { createAbstractApplication } from '@metafoks/app';

describe('chat testing', () => {
    let app!: MetafoksAbstractContext;

    beforeAll(async () => {
        app = await createAbstractApplication({
            config: defaultAppConfig,
            extensions: [openAIExtension],
        });
    });

    const createThreadFn = jest.fn(() => ({
        id: 'testThreadId',
    }));

    const createMessageFn = jest.fn(() => ({
        id: 'testThreadId',
        runId: 'createMessageRunId',
    }));

    const createRunFn = jest.fn(() => ({
        id: 'testRunId',
        thread_id: 'testThreadId',
        model: 'testModel',
        assistant_id: 'testAssistant',
    }));

    const retrieveFn = jest.fn(() => ({
        id: 'testRunId',
        thread_id: 'testThreadId',
        model: 'testModel',
        assistant_id: 'testAssistant',
        status: 'completed',
    }));

    const listFn = jest.fn(() => ({
        data: [
            {
                content: [{ type: 'text', text: { value: 'hello' } }],
            },
        ],
    }));

    beforeEach(() => {
        createThreadFn.mockClear();
        createMessageFn.mockClear();
        createRunFn.mockClear();
        retrieveFn.mockClear();
        listFn.mockClear();

        app.mock('openai', {
            beta: {
                threads: {
                    create: createThreadFn,
                    messages: {
                        create: createMessageFn,
                        list: listFn,
                    },
                    runs: {
                        create: createRunFn,
                        retrieve: retrieveFn,
                    },
                },
            },
        });
    });

    it('testing sending message', async () => {
        // when
        const thread = await app.resolve<OpenAIThreadLoader>('openAIThread').create();
        await thread.createUserMessage({ message: 'hi' });
        const task = await thread.addAssistant({ assistantId: 'testAssistant' });
        await task.waitForComplete();
        const message = await thread.getLastMessageInThread();

        // then
        expect(createThreadFn).toHaveBeenCalledTimes(1);
        expect(createMessageFn).toHaveBeenCalledWith('testThreadId', { role: 'user', content: 'hi' });
        expect(createRunFn).toHaveBeenCalledWith('testThreadId', { assistant_id: 'testAssistant' });

        expect(retrieveFn).toHaveBeenCalledTimes(1);
        expect(retrieveFn).toHaveBeenCalledWith('testThreadId', 'testRunId');

        expect(listFn).toHaveBeenCalledWith('testThreadId', {
            limit: 2,
        });
    });
});
