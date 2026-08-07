/**
 * TCGplayer API Error Types
 */

/**
 * Error thrown when a TCGplayer API request fails.
 *
 * @example
 * try {
 *   const product = await client.products.details(999999999);
 * } catch (err) {
 *   if (err instanceof TCGplayerError) {
 *     console.log(`HTTP ${err.status} from ${err.endpoint}`);
 *   }
 * }
 */
export class TCGplayerError extends Error {
  /** HTTP status code of the failed request */
  public readonly status: number;
  /** The API endpoint that failed */
  public readonly endpoint: string;

  constructor(status: number, endpoint: string, message: string) {
    super(message);
    this.name = 'TCGplayerError';
    this.status = status;
    this.endpoint = endpoint;
  }

  /** Serialize error to JSON for logging */
  toJSON() {
    return {
      name: this.name,
      status: this.status,
      endpoint: this.endpoint,
      message: this.message,
    };
  }
}

/**
 * Error thrown when an invalid parameter is passed to an SDK method.
 *
 * @example
 * try {
 *   await client.products.details(-1);
 * } catch (err) {
 *   if (err instanceof ValidationError) {
 *     console.log(err.message); // Validation failed for "productId": must be a positive number
 *   }
 * }
 */
export class ValidationError extends TCGplayerError {
  constructor(param: string, message: string) {
    super(0, '', `Validation failed for "${param}": ${message}`);
    this.name = 'ValidationError';
  }
}

/**
 * Error thrown when a requested resource does not exist (HTTP 404).
 */
export class NotFoundError extends TCGplayerError {
  constructor(endpoint: string) {
    super(404, endpoint, `Resource not found at ${endpoint}`);
    this.name = 'NotFoundError';
  }
}
