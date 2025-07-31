export interface RemoteConfig {
    key: string;
    timeout: number;
    retries: number;
    debug: boolean;
    lastUpdated: string;
}

export interface WebSocketMessage {
    type: string;
    data: any;
}

export interface ApiResponse {
    success: boolean;
    config?: RemoteConfig;
    error?: string;
}