import { OpenAI } from '../loaders';
import { MessageCreateParams, RunCreateParams } from 'openai/resources/beta/threads';
import { OpenAIMessageContent } from '../dto';
import { createLogger, LoggerFactory } from '@metafoks/app';
import { TaskComponent } from './task.component';

export class ThreadComponent {
    private static thisLogger = createLogger(ThreadComponent);
    private static threads: Record<string, ThreadComponent> = {};

    /**
     * Returns thread
     * @param props
     */
    public static thread(props: { threadId: string; openai: OpenAI }) {
        this.thisLogger.debug(`init new instance threadId=${props.threadId}`);
        if (!this.threads[props.threadId]) this.threads[props.threadId] = new ThreadComponent(props);

        this.thisLogger.info('thread inited');
        return this.threads[props.threadId];
    }

    /**
     * Creates new thread
     * @param props
     */
    public static async create(props: { openai: OpenAI }) {
        this.thisLogger.debug(`creating new thread`);
        const thread = await props.openai.beta.threads.create();

        this.thisLogger.info(`new thread with id=${thread.id} created`);
        return this.thread({ threadId: thread.id, openai: props.openai });
    }

    private logger: ReturnType<typeof createLogger>;

    public constructor(private deps: { threadId: string; openai: OpenAI }) {
        this.logger = LoggerFactory.createLoggerByName(`Thread#${deps.threadId}`);
    }

    public get threadId(): string {
        return this.deps.threadId;
    }

    /**
     * Runs task
     *
     * @param props
     */
    public async task(props: { body: RunCreateParams }) {
        const { openai, threadId } = this.deps;

        this.logger.debug(`creating run to openai`);
        return new TaskComponent({
            run: await openai.beta.threads.runs.create(threadId, props.body),
            openai,
        });
    }

    public async createMessage(props: { body: MessageCreateParams }) {
        const { openai, threadId } = this.deps;

        this.logger.debug('creating new message');
        const result = await openai.beta.threads.messages.create(threadId, props.body);

        this.logger.info(`created new message`);
        return result;
    }

    /**
     * Sends user message to thread
     * @param props
     */
    public async createUserMessage(props: { message: string }) {
        this.logger.debug(`creating user message with tokens length=${props.message.length}`);
        return this.createMessage({ body: { role: 'user', content: props.message } });
    }

    /**
     * Adding assistant to the thread
     * @param props
     */
    public async addAssistant(props: { assistantId: string }) {
        const { assistantId } = props;
        this.logger.debug(`adding assistant=${assistantId}`);
        const result = await this.task({ body: { assistant_id: assistantId } });

        this.logger.info(`added assistant=${assistantId}, usage tokens=${result.source.usage?.total_tokens}`);
        return result;
    }

    /**
     * Returns the last message in thread
     */
    public async getLastMessageInThread(): Promise<OpenAIMessageContent | undefined> {
        const { openai, threadId } = this.deps;

        this.logger.debug(`receiving last message`);
        const list = await openai.beta.threads.messages.list(threadId, {
            limit: 2,
        });

        const firstData = list.data[0];
        const firstContent = firstData.content[0];

        this.logger.info(`received last ${list.data.length} messages`);

        if (firstContent.type === 'text') {
            return {
                type: 'text',
                value: firstContent.text.value,
            };
        }

        return undefined;
    }
}
