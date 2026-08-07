/**
 * Products Resource
 */
import { TCGplayerError, ValidationError } from '../errors.js';
import { BASE_URLS, DEFAULT_HEADERS, POST_HEADERS, DEFAULT_MPFEV } from '../constants.js';
function assertPositiveNumber(value, name) {
    if (typeof value !== 'number' || value <= 0) {
        throw new ValidationError(name, 'must be a positive number');
    }
}
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
export class ProductsResource {
    async details(productId) {
        assertPositiveNumber(Number(productId), 'productId');
        const mpfev = DEFAULT_MPFEV;
        const url = `${BASE_URLS['mp-search-api']}/v2/product/${productId}/details?mpfev=${mpfev}`;
        return request(url);
    }
    async listings(productId, options = {}) {
        assertPositiveNumber(Number(productId), 'productId');
        const { sellerStatus = 'Live', channelId = 0, languages = ['English'], conditions = [], quantityGte = 1, } = options;
        const body = {
            filters: {
                term: {
                    sellerStatus,
                    channelId,
                    ...(languages.length ? { language: languages } : {}),
                    ...(conditions.length ? { condition: conditions } : {}),
                },
                range: { quantity: { gte: quantityGte } },
            },
        };
        const url = `${BASE_URLS['mp-search-api']}/v1/product/${productId}/listings`;
        return postRequest(url, body);
    }
    async sales(productId, options = {}) {
        assertPositiveNumber(Number(productId), 'productId');
        const { mpfev = DEFAULT_MPFEV, conditions = [], languages = [1], variants = [], listingType = 'All', limit = 25, } = options;
        const url = `${BASE_URLS.mpapi}/v2/product/${productId}/latestsales?mpfev=${mpfev}`;
        return postRequest(url, { conditions, languages, variants, listingType, limit });
    }
    async priceHistory(productId, options = {}) {
        assertPositiveNumber(Number(productId), 'productId');
        const { range = 'quarter' } = options;
        const pageRequestId = `${Date.now()}:www.tcgplayer.com/product/${productId}`;
        const url = `${BASE_URLS['infinite-api']}/price/history/${productId}/detailed?range=${range}`;
        return request(url, {
            headers: {
                ...DEFAULT_HEADERS,
                'Accept': '*/*',
                'X-PageRequest-ID': pageRequestId,
            },
        });
    }
    async volatility(skuId, mpfev = DEFAULT_MPFEV) {
        assertPositiveNumber(Number(skuId), 'skuId');
        const url = `${BASE_URLS.mpgateway}/v1/pricepoints/marketprice/skus/${skuId}/volatility?mpfev=${mpfev}`;
        return request(url);
    }
    async buylistPrice(productId, mpfev = DEFAULT_MPFEV) {
        assertPositiveNumber(Number(productId), 'productId');
        const url = `${BASE_URLS.mpgateway}/v1/pricepoints/buylist/marketprice/products/${productId}?mpfev=${mpfev}`;
        return request(url);
    }
    async infinite(productId) {
        assertPositiveNumber(Number(productId), 'productId');
        const url = `${BASE_URLS['infinite-api']}/product/${productId}`;
        return request(url);
    }
}
//# sourceMappingURL=products.js.map