/**
 * Pricing Resource
 */
import { TCGplayerError, ValidationError } from '../errors.js';
import { BASE_URLS, POST_HEADERS, DEFAULT_HEADERS, DEFAULT_MPFEV } from '../constants.js';
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
export class PricingResource {
    async skuMarketPrices(skuIds, mpfev = DEFAULT_MPFEV) {
        if (!Array.isArray(skuIds) || skuIds.length === 0) {
            throw new ValidationError('skuIds', 'must be a non-empty array');
        }
        for (const id of skuIds) {
            if (typeof id !== 'number' || id <= 0) {
                throw new ValidationError('skuIds', 'must contain only positive numbers');
            }
        }
        const url = `${BASE_URLS.mpgateway}/v1/pricepoints/marketprice/skus/search?mpfev=${mpfev}`;
        return postRequest(url, { skuIds });
    }
}
//# sourceMappingURL=pricing.js.map