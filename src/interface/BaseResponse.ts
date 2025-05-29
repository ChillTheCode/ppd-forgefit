export interface BaseResponse<T = unknown> {
    status: number;
    message: string;
    data: T | null;
    timestamp: string | null;
}
