import { bytesToHex } from './bytes';
import { MediaType } from './media';

/**
 * 파일 타입 감지
 */
export function detectFileType(path: string): MediaType {
    const extension = path.split('.').pop()?.toLowerCase();
    
    switch (extension) {
        case 'webp':
            return 'image/webp';
        case 'ogg':
            return 'audio/ogg';
        default:
            throw new Error(`지원하지 않는 파일 형식입니다: ${extension}`);
    }
}

/**
 * RIFF 헤더 찾기
 */
export function findRiffHeader(data: Uint8Array): number {
    // RIFF 헤더는 파일의 시작 부분에 있어야 함
    if (data.length < 12) {
        throw new Error('파일 데이터가 너무 짧습니다.');
    }

    // RIFF 헤더 검사 (RIFF 시그니처 + WEBP FourCC)
    if (data[0] === 0x52 && data[1] === 0x49 && data[2] === 0x46 && data[3] === 0x46 &&
        data[8] === 0x57 && data[9] === 0x45 && data[10] === 0x42 && data[11] === 0x50) {
        return 0;
    }

    // RIFF 헤더가 다른 위치에 있는 경우 찾기
    for (let i = 0; i < data.length - 12; i++) {
        if (data[i] === 0x52 && data[i + 1] === 0x49 && data[i + 2] === 0x46 && data[i + 3] === 0x46 &&
            data[i + 8] === 0x57 && data[i + 9] === 0x45 && data[i + 10] === 0x42 && data[i + 11] === 0x50) {
            console.log('RIFF 헤더를 찾았습니다:', i);
            return i;
        }
    }

    throw new Error('RIFF 헤더를 찾을 수 없습니다.');
}

/**
 * 파일 데이터 검증 및 처리
 */
export function processFileData(fileData: Uint8Array, path: string): Uint8Array {
    if (fileData.length === 0) {
        throw new Error('추출된 파일 데이터가 비어있습니다.');
    }

    // 파일 타입 감지
    const fileType = detectFileType(path);
    
    // WebP 파일인 경우에만 RIFF 헤더 처리
    if (fileType === 'image/webp') {
        try {
            const riffIndex = findRiffHeader(fileData);
            console.log('RIFF 헤더 위치:', riffIndex);
            console.log('RIFF 헤더 이후 데이터:', bytesToHex(fileData.slice(riffIndex, riffIndex + 32)));
            
            // RIFF 헤더가 시작 부분에 없으면 데이터 조정
            if (riffIndex > 0) {
                return fileData.slice(riffIndex);
            }
            return fileData;
        } catch (error) {
            console.error('RIFF 헤더 처리 실패:', error);
            throw error;
        }
    }
    
    // OGG 파일은 그대로 반환
    return fileData;
}

/**
 * 파일 URL 생성
 */
export function createFileUrl(fileData: Uint8Array, path: string): string {
    const fileType = detectFileType(path);
    const blob = new Blob([fileData], { type: fileType });
    return URL.createObjectURL(blob);
}

/**
 * 이미지 로드 처리
 */
export function loadImage(url: string, onLoad?: () => void, onError?: (error: Event | string) => void): void {
    const img = new Image();
    img.onload = () => {
        console.log('이미지 로드 완료');
        onLoad?.();
    };
    img.onerror = (error) => {
        console.error('이미지 로드 실패:', error);
        onError?.(error);
    };
    img.src = url;
}

/**
 * 오디오 로드 처리
 */
export function loadAudio(url: string, onLoad?: () => void, onError?: (error: Event | string) => void): void {
    const audio = new Audio();
    audio.oncanplaythrough = () => {
        console.log('오디오 로드 완료');
        onLoad?.();
    };
    audio.onerror = (error) => {
        console.error('오디오 로드 실패:', error);
        onError?.(error);
    };
    audio.src = url;
} 