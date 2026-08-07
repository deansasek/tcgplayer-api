/**
 * TCGplayer API Error Types
 */
export declare class TCGplayerError extends Error {
    readonly status: number;
    readonly endpoint: string;
    constructor(status: number, endpoint: string, message: string);
    toJSON(): {
        name: string;
        status: number;
        endpoint: string;
        message: string;
    };
}
export declare class ValidationError extends TCGplayerError {
    constructor(param: string, message: string);
}
export declare class NotFoundError extends TCGplayerError {
    constructor(endpoint: string);
}
//# sourceMappingURL=errors.d.ts.map