import { OpenAI } from './openai.loader';
import { ThreadComponent } from '../components';

export default function (props: { openai: OpenAI }): OpenAIThreadLoader {
    return {
        async create(): Promise<ThreadComponent> {
            return await ThreadComponent.create({ openai: props.openai });
        },
        getThread(threadId: string): ThreadComponent {
            return ThreadComponent.thread({ threadId, openai: props.openai });
        },
    };
}

export interface OpenAIThreadLoader {
    create(): Promise<ThreadComponent>;
    getThread(threadId: string): ThreadComponent;
}
