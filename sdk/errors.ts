/**
 * TCGplayer API Error Types
 */

export class TCGplayerError extends Error {
  public readonly status: number;
  public readonly endpoint: string;

  constructor(status: number, endpoint: string, message: string) {
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
  constructor(param: string, message: string) {
    super(0, '', `Validation failed for "${param}": ${message}`);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends TCGplayerError {
  constructor(endpoint: string) {
    super(404, endpoint, `Resource not found at ${endpoint}`);
    this.name = 'NotFoundError';
  }
}
