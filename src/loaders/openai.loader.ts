import openai, { OpenAI as CoreOpenAI } from 'openai';
import { ConfigWithOpenAI } from '../config';

export type OpenAI = CoreOpenAI;

export default function (props: { config: ConfigWithOpenAI }) {
    return new CoreOpenAI({
        apiKey: props.config.openai.token,
        organization: props.config.openai.organizationId,
    });
}
