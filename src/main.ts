import { ZstdHandler } from './utils/zstd';

// DOM 요소
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const fileList = document.getElementById('fileList') as HTMLUListElement;
const fileDisplay = document.getElementById('fileDisplay') as HTMLDivElement;
const status = document.getElementById('status') as HTMLDivElement;

// ZSTD 핸들러
const zstdHandler = new ZstdHandler();

// 파일 선택 이벤트 처리
fileInput.addEventListener('change', async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
        // 파일 읽기
        const arrayBuffer = await file.arrayBuffer();
        const compressedData = new Uint8Array(arrayBuffer);
        
        // ZSTD 초기화
        await zstdHandler.initialize(compressedData);
        
        // 파일 목록 가져오기
        const files = await zstdHandler.getFileList();
        
        // 파일 목록 표시
        fileList.innerHTML = '';
        files.forEach(path => {
            const li = document.createElement('li');
            li.textContent = path;
            li.style.cursor = 'pointer';
            li.addEventListener('click', () => {
                zstdHandler.extractAndDisplayFile(path, fileDisplay);
            });
            fileList.appendChild(li);
        });
        
        status.textContent = '파일 로드 완료';
    } catch (error) {
        console.error('파일 처리 중 오류 발생:', error);
        status.textContent = '오류 발생: ' + (error instanceof Error ? error.message : String(error));
    }
});

// 페이지 언로드 시 리소스 정리
window.addEventListener('unload', () => {
    zstdHandler.dispose();
}); 