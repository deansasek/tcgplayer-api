/**
 * TCGplayer API Error Types
 */
export class TCGplayerError extends Error {
    status;
    endpoint;
    constructor(status, endpoint, message) {
        super(message);
        this.name = 'TCGplayerError';
        this.status = status;
        this.endpoint = endpoint;
    }
    toJSON() {
        return {
            name: this.name,
            status: this.status,
            endpoint: this.endpoint,
            message: this.message,
        };
    }
}
export class ValidationError extends TCGplayerError {
    constructor(param, message) {
        super(0, '', `Validation failed for "${param}": ${message}`);
        this.name = 'ValidationError';
    }
}
export class NotFoundError extends TCGplayerError {
    constructor(endpoint) {
        super(404, endpoint, `Resource not found at ${endpoint}`);
        this.name = 'NotFoundError';
    }
}
//# sourceMappingURL=errors.js.map