export interface OpenAITaskRun {
    id: string;
    assistant_id: string;

    /**
     * The status of the run, which can be either `queued`, `in_progress`,
     * `requires_action`, `cancelling`, `cancelled`, `failed`, `completed`, or
     * `expired`.
     */
    status:
        | 'queued'
        | 'in_progress'
        | 'requires_action'
        | 'cancelling'
        | 'cancelled'
        | 'failed'
        | 'completed'
        | 'expired';

    /**
     * The ID of the [thread](https://platform.openai.com/docs/api-reference/threads)
     * that was executed on as a part of this run.
     */
    thread_id: string;

    model: string;
}

export function isStatusIsWaiting(status: OpenAITaskRun['status']) {
    return status === 'in_progress' || status === 'queued';
}

export function isSuccessRunStatus(status: OpenAITaskRun['status']) {
    return !isStatusIsWaiting(status);
}
