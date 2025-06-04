import init from 'zstd-streaming-reader';
import { ZstdReader } from 'zstd-streaming-reader';
import { processFileData, createFileUrl, detectFileType } from './image';
import { FileCache, FileCacheManager } from './cache';
import { MediaHandler } from './media';

/**
 * ZSTD 파일 처리기
 */
export class ZstdHandler {
    private reader: ZstdReader | null = null;
    private cacheManager: FileCacheManager;
    private mediaHandler: MediaHandler;

    constructor() {
        this.cacheManager = new FileCacheManager();
        this.mediaHandler = new MediaHandler();
    }

    /**
     * ZSTD 파일 초기화
     */
    async initialize(compressedData: Uint8Array): Promise<void> {
        this.cacheManager.clear();
        await init();
        this.reader = new ZstdReader(compressedData);
    }

    /**
     * 파일 목록 가져오기
     */
    async getFileList(): Promise<string[]> {
        if (!this.reader) {
            throw new Error('ZSTD 리더가 초기화되지 않았습니다.');
        }
        const fileList = await this.reader.get_file_list();
        return fileList.map(file => file.path);
    }

    /**
     * 파일 데이터 가져오기
     */
    private async getFileData(path: string): Promise<FileCache> {
        // 캐시된 데이터가 있으면 반환
        const cached = this.cacheManager.get(path);
        if (cached) {
            console.log('캐시된 파일 데이터 사용:', path);
            return cached;
        }

        if (!this.reader) {
            throw new Error('ZSTD 리더가 초기화되지 않았습니다.');
        }

        // 파일 데이터 추출 및 처리
        const fileData = await this.reader.extract_file(path);
        const validFileData = processFileData(fileData, path);
        const fileType = detectFileType(path);
        const url = createFileUrl(validFileData, path);

        // 캐시에 저장
        const cache: FileCache = {
            data: validFileData,
            url,
            type: fileType
        };
        this.cacheManager.set(path, cache);

        return cache;
    }

    /**
     * 파일 추출 및 표시
     */
    async extractAndDisplayFile(path: string, displayElement: HTMLElement): Promise<void> {
        try {
            const cache = await this.getFileData(path);
            this.mediaHandler.displayMedia(cache, displayElement);
        } catch (error) {
            console.error('파일 추출 실패:', error);
            displayElement.innerHTML = `<div class="error">파일 로드 실패: ${error instanceof Error ? error.message : String(error)}</div>`;
        }
    }

    /**
     * 리소스 정리
     */
    dispose(): void {
        this.mediaHandler.dispose();
        this.cacheManager.clear();
        this.reader = null;
    }
} 