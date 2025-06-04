/**
 * 바이트 배열을 16진수 문자열로 변환
 */
export function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join(' ');
}

/**
 * 바이트 배열을 ASCII 문자열로 변환
 */
export function bytesToAscii(bytes: Uint8Array): string {
    return Array.from(bytes)
        .map(b => b >= 32 && b <= 126 ? String.fromCharCode(b) : '.')
        .join('');
}

/**
 * RIFF 청크 크기 계산
 */
export function calculateRiffSize(data: Uint8Array, startIndex: number): number {
    // RIFF 헤더는 8바이트 (4바이트 헤더 + 4바이트 크기)
    if (startIndex + 8 > data.length) {
        return 0;
    }
    
    // 리틀 엔디안으로 4바이트 정수 읽기
    const size = (data[startIndex + 4] ?? 0) |
                ((data[startIndex + 5] ?? 0) << 8) |
                ((data[startIndex + 6] ?? 0) << 16) |
                ((data[startIndex + 7] ?? 0) << 24);
    
    return size;
} 