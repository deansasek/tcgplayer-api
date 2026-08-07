/**
 * Content Resource
 */
import { TCGplayerError } from '../errors.js';
import { BASE_URLS, DEFAULT_HEADERS, POST_HEADERS } from '../constants.js';
async function request(url, options) {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...DEFAULT_HEADERS,
            ...options?.headers,
        },
    });
    if (!response.ok) {
        throw new TCGplayerError(response.status, url, `${options?.method || 'GET'} ${url} failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
async function postRequest(url, body) {
    const response = await fetch(url, {
        method: 'POST',
        headers: POST_HEADERS,
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        throw new TCGplayerError(response.status, url, `POST ${url} failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
export class ContentResource {
    async articles(options = {}) {
        const { vertical = 'pokemon', limit = 10 } = options;
        const params = new URLSearchParams({ vertical, limit: String(limit) });
        const url = `${BASE_URLS['infinite-api']}/c/articles/?${params}`;
        return request(url);
    }
    async trendingArticles(options = {}) {
        const { limit = 10 } = options;
        const params = new URLSearchParams({ limit: String(limit) });
        const url = `${BASE_URLS['infinite-api']}/content/articles/trending/?${params}`;
        return request(url);
    }
    async tags(options = {}) {
        const { domains = 'marketplace', classifications = 'product line affinity' } = options;
        const params = new URLSearchParams({ domains, classifications });
        const url = `${BASE_URLS['infinite-api']}/c/tags?${params}`;
        return request(url);
    }
    async kickbacks(options = {}) {
        const { active = true } = options;
        const params = new URLSearchParams({ active: String(active) });
        const url = `${BASE_URLS.mpapi}/v2/kickbacks?${params}`;
        const data = await request(url);
        return data.results || [];
    }
    async normalizeCardName(name) {
        if (typeof name !== 'string' || name.trim() === '') {
            throw new ValidationError('name', 'must be a non-empty string');
        }
        const url = `${BASE_URLS['infinite-api']}/card/normalize/${encodeURIComponent(name)}`;
        return request(url);
    }
}
class ValidationError extends Error {
    constructor(param, message) {
        super(`Validation failed for "${param}": ${message}`);
        this.name = 'ValidationError';
    }
}
//# sourceMappingURL=content.js.map