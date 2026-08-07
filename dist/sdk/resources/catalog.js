/**
 * Catalog Resource
 */
import { TCGplayerError, ValidationError } from '../errors.js';
import { BASE_URLS, DEFAULT_HEADERS, DEFAULT_MPFEV } from '../constants.js';
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
export class CatalogResource {
    async productLines() {
        const url = `${BASE_URLS['mp-search-api']}/v1/search/productLines`;
        return request(url);
    }
    async productLineMappings(productLine = 'Pokemon', mpfev = DEFAULT_MPFEV) {
        const url = `${BASE_URLS['mp-search-api']}/v1/search/productLineMappings?productLine=${encodeURIComponent(productLine)}&mpfev=${mpfev}`;
        return request(url);
    }
    async categoryFilters(categoryId = '3', mpfev = DEFAULT_MPFEV) {
        const url = `${BASE_URLS['mp-search-api']}/v1/product/categoryfilters?categoryId=${categoryId}&mpfev=${mpfev}`;
        return request(url);
    }
    async latestSets(productLineIds = '1,2,3,71,68,63,79,62,85') {
        const url = `${BASE_URLS['mp-search-api']}/v1/product/latestsets/${productLineIds}`;
        return request(url);
    }
    async setName(setId) {
        assertPositiveNumber(Number(setId), 'setId');
        const url = `${BASE_URLS.mpapi}/v2/Catalog/SetName/${setId}`;
        return request(url);
    }
    async catalogGroups() {
        const url = `${BASE_URLS.mpapi}/v2/Catalog/CatalogGroups`;
        return request(url);
    }
    async verticals() {
        const url = `${BASE_URLS['infinite-api']}/c/verticals/`;
        return request(url);
    }
}
function assertPositiveNumber(value, name) {
    if (typeof value !== 'number' || value <= 0) {
        throw new ValidationError(name, 'must be a positive number');
    }
}
//# sourceMappingURL=catalog.js.map