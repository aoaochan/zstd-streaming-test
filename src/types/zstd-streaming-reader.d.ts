declare module 'zstd-streaming-reader' {
    export interface FileInfo {
        path: string;
        size: number;
    }

    export class ZstdReader {
        constructor(data: Uint8Array);
        get_file_list(): Promise<FileInfo[]>;
        extract_file(path: string): Promise<Uint8Array>;
    }

    export default function init(): Promise<void>;
} 