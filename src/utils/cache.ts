/**
 * 파일 데이터 캐시 인터페이스
 */
export interface FileCache {
    data: Uint8Array;
    url: string;
    type: string;
}

/**
 * 파일 캐시 관리자
 */
export class FileCacheManager {
    private cache: Map<string, FileCache> = new Map();

    /**
     * 캐시된 파일 데이터 가져오기
     */
    get(path: string): FileCache | undefined {
        return this.cache.get(path);
    }

    /**
     * 파일 데이터 캐시에 저장
     */
    set(path: string, cache: FileCache): void {
        this.cache.set(path, cache);
    }

    /**
     * 캐시 초기화
     */
    clear(): void {
        // URL 해제
        this.cache.forEach(cache => URL.revokeObjectURL(cache.url));
        this.cache.clear();
    }
} 