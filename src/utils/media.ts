import { FileCache } from './cache';

/**
 * 미디어 파일 타입
 */
export type MediaType = 'image/webp' | 'audio/ogg';

/**
 * 미디어 파일 처리기
 */
export class MediaHandler {
    private currentAudio: HTMLAudioElement | null = null;

    /**
     * 이미지 로드
     */
    loadImage(url: string, displayElement: HTMLElement): void {
        const img = document.createElement('img');
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        displayElement.appendChild(img);

        img.onload = () => {
            img.src = url;
            img.style.display = 'block';
        };
        img.onerror = (error) => {
            console.error('이미지 로드 실패:', error);
            img.style.display = 'none';
        };
        img.src = url;
    }

    /**
     * 오디오 로드
     */
    loadAudio(url: string, displayElement: HTMLElement): void {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }

        const audioElement = document.createElement('audio');
        audioElement.controls = true;
        audioElement.style.width = '100%';
        displayElement.appendChild(audioElement);

        // 오디오 로드 이벤트 처리
        audioElement.oncanplaythrough = () => {
            console.log('오디오 로드 완료');
            this.currentAudio = audioElement;
        };

        audioElement.onerror = (error) => {
            console.error('오디오 로드 실패:', error);
            audioElement.style.display = 'none';
        };

        // 오디오 메타데이터 로드 이벤트
        audioElement.onloadedmetadata = () => {
            console.log('오디오 메타데이터 로드 완료');
        };

        // 오디오 데이터 로드 이벤트
        audioElement.onloadeddata = () => {
            console.log('오디오 데이터 로드 완료');
        };

        // 오디오 소스 설정
        audioElement.src = url;
        audioElement.load(); // 명시적으로 로드 시작
    }

    /**
     * 미디어 파일 표시
     */
    displayMedia(cache: FileCache, displayElement: HTMLElement): void {
        displayElement.innerHTML = '';
        
        if (cache.type === 'image/webp') {
            this.loadImage(cache.url, displayElement);
        } else if (cache.type === 'audio/ogg') {
            this.loadAudio(cache.url, displayElement);
        }
    }

    /**
     * 리소스 정리
     */
    dispose(): void {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }
    }
} 