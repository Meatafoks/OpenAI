import { toFile } from 'openai';
import fs from 'fs';

export * from './openAITiktokenUtils';

export async function createFileByUrl(fileUrl: string) {
    const response = await fetch(fileUrl);
    const blob = await response.arrayBuffer();
    const ext = fileUrl.split('.').pop();
    return await toFile(blob, `file.${ext}`);
}

export async function createFileByLocalPath(path: string) {
    const data = fs.readFileSync(path);
    const ext = path.split('.').pop();
    return await toFile(data, `file.${ext}`);
}
