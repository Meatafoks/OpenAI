import { Run } from 'openai/resources/beta/threads';
import { createLogger, LoggerFactory } from '@metafoks/app';
import { isStatusIsWaiting, OpenAITaskRun } from '../dto';
import { timeout } from '@metafoks/utils';
import { OpenAI } from '../loaders';
import { RunStep } from 'openai/src/resources/beta/threads/runs/steps';

export class TaskComponent {
    private logger: ReturnType<typeof createLogger>;

    public constructor(private deps: { run: Run; openai: OpenAI }) {
        this.logger = LoggerFactory.createLoggerByName(`Run#${deps.run.id}`);
    }

    public get source(): Run {
        return this.deps.run;
    }

    public get threadId(): string {
        return this.source.thread_id;
    }

    public get runId(): string {
        return this.source.id;
    }

    public get assistantId(): string {
        return this.source.assistant_id;
    }

    /**
     * Retrieves message
     * @param props
     */
    public async retrieve(): Promise<Run> {
        const { threadId, runId } = this;

        this.logger.debug(`retrieving data...`);
        return this.deps.openai.beta.threads.runs.retrieve(threadId, runId);
    }

    /**
     * Waiting for completion
     * @param props
     */
    public async waitForComplete(props: { onProcess?: () => void } = {}) {
        const { onProcess } = props;

        let lastRun: Run | undefined = undefined;
        let status: OpenAITaskRun['status'] = 'in_progress';
        let iteration = 1;

        this.logger.debug(`starting awaiting loop`);
        onProcess?.();

        const timeStart = new Date().getTime();

        await timeout(2000 * iteration);
        while (isStatusIsWaiting(status)) {
            this.logger.debug(`awaiting loop, it=${iteration}`);

            onProcess?.();
            const run = await this.retrieve();

            status = run.status;
            lastRun = run;

            await timeout(100 * iteration);
            iteration += 1;

            if (!isStatusIsWaiting(status)) {
                const timeEnd = Math.round((((new Date().getTime() - timeStart) / 1000) * 100) / 100);
                this.logger.info(
                    `assistant=${run.assistant_id} (aka ${run.model}) successful solved task for ${timeEnd} seconds, usage=${JSON.stringify(lastRun.usage)}`,
                );
            }
        }

        return lastRun;
    }
}
