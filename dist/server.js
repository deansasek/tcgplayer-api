/**
 * TCGplayer REST API Wrapper
 *
 * Base URLs:
 * - data.tcgplayer.com      - Autocomplete
 * - mpapi.tcgplayer.com     - Sales data
 * - mp-search-api.tcgplayer.com - Search, product details, categories
 * - infinite-api.tcgplayer.com - Price history
 * - mpgateway.tcgplayer.com - Pricing data
 */
import { BASE_URLS, DEFAULT_HEADERS, POST_HEADERS } from './sdk/constants.js';
// Re-export SDK types and constants
export { CONDITIONS, PRICE_RANGES, BASE_URLS } from './sdk/constants.js';
/**
 * Generate a session ID for autocomplete requests
 */
function generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}
/**
 * Search for products using autocomplete
 */
export async function autocomplete(query, options = {}) {
    const { productLine = 'Pokemon', sessionId = generateSessionId() } = options;
    const params = new URLSearchParams({
        q: query,
        'session-id': sessionId,
        'product-line-affinity': productLine,
        algorithm: 'product_line_affinity',
    });
    const response = await fetch(`${BASE_URLS.data}/autocomplete?${params}`, {
        headers: DEFAULT_HEADERS,
    });
    if (!response.ok) {
        throw new Error(`Autocomplete failed: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.products || [];
}
/**
 * Search products with full filtering, sorting, and pagination
 */
export async function search(options = {}) {
    const { q = '', productLine = 'Pokemon', from = 0, size = 24, algorithm = 'sales_dismax', filters = {}, sort = {}, shippingCountry = 'US', } = options;
    const body = {
        algorithm,
        from,
        size,
        filters: {
            term: {
                productLineName: [productLine],
                ...filters.term,
            },
            range: filters.range || {},
            match: filters.match || {},
        },
        listingSearch: {
            context: { cart: { packages: {} } },
            filters: {
                term: { sellerStatus: 'Live', channelId: 0 },
                range: { quantity: { gte: 1 } },
                exclude: { channelExclusion: 0 },
            },
        },
        context: {
            cart: { packages: {} },
            shippingCountry,
            userProfile: {},
        },
        settings: {
            useFuzzySearch: true,
            didYouMean: {},
        },
        sort,
    };
    const response = await fetch(`${BASE_URLS['mp-search-api']}/v1/search/request?q=${encodeURIComponent(q)}&isList=false&mpfev=5429`, {
        method: 'POST',
        headers: POST_HEADERS,
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get detailed product information
 */
export async function getProductDetails(productId, mpfev = '5429') {
    const response = await fetch(`${BASE_URLS['mp-search-api']}/v2/product/${productId}/details?mpfev=${mpfev}`, {
        headers: DEFAULT_HEADERS,
    });
    if (!response.ok) {
        throw new Error(`Product details failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get latest sales for a product
 */
export async function getLatestSales(productId, options = {}) {
    const { mpfev = '5429', conditions = [], languages = [1], variants = [], listingType = 'All', limit = 25, } = options;
    const response = await fetch(`${BASE_URLS.mpapi}/v2/product/${productId}/latestsales?mpfev=${mpfev}`, {
        method: 'POST',
        headers: POST_HEADERS,
        body: JSON.stringify({ conditions, languages, variants, listingType, limit }),
    });
    if (!response.ok) {
        throw new Error(`Latest sales failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get price history for a product
 */
export async function getPriceHistory(productId, options = {}) {
    const { range = 'quarter' } = options;
    const pageRequestId = `${Date.now()}:www.tcgplayer.com/product/${productId}`;
    const response = await fetch(`${BASE_URLS['infinite-api']}/price/history/${productId}/detailed?range=${range}`, {
        headers: {
            ...DEFAULT_HEADERS,
            'Accept': '*/*',
            'X-PageRequest-ID': pageRequestId,
        },
    });
    if (!response.ok) {
        throw new Error(`Price history failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get market price volatility for a SKU
 */
export async function getVolatility(skuId, mpfev = '5429') {
    const response = await fetch(`${BASE_URLS.mpgateway}/v1/pricepoints/marketprice/skus/${skuId}/volatility?mpfev=${mpfev}`, {
        headers: DEFAULT_HEADERS,
    });
    if (!response.ok) {
        throw new Error(`Volatility failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get buylist prices for a product
 */
export async function getBuylistPrice(productId, mpfev = '5429') {
    const response = await fetch(`${BASE_URLS.mpgateway}/v1/pricepoints/buylist/marketprice/products/${productId}?mpfev=${mpfev}`, {
        headers: DEFAULT_HEADERS,
    });
    if (!response.ok) {
        throw new Error(`Buylist failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get market prices for multiple SKUs at once
 */
export async function getSkuMarketPrices(skuIds, mpfev = '5429') {
    const response = await fetch(`${BASE_URLS.mpgateway}/v1/pricepoints/marketprice/skus/search?mpfev=${mpfev}`, {
        method: 'POST',
        headers: POST_HEADERS,
        body: JSON.stringify({ skuIds }),
    });
    if (!response.ok) {
        throw new Error(`SKU market prices failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get available product lines/categories
 */
export async function getProductLines() {
    const response = await fetch(`${BASE_URLS['mp-search-api']}/v1/search/productLines`, {
        headers: DEFAULT_HEADERS,
    });
    if (!response.ok) {
        throw new Error(`Product lines failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get search filter field mappings for a product line
 */
export async function getProductLineMappings(productLine = 'Pokemon', mpfev = '5429') {
    const response = await fetch(`${BASE_URLS['mp-search-api']}/v1/search/productLineMappings?productLine=${encodeURIComponent(productLine)}&mpfev=${mpfev}`, {
        headers: DEFAULT_HEADERS,
    });
    if (!response.ok) {
        throw new Error(`Product line mappings failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get category filters for a product line
 */
export async function getCategoryFilters(categoryId = '3', mpfev = '5429') {
    const response = await fetch(`${BASE_URLS['mp-search-api']}/v1/product/categoryfilters?categoryId=${categoryId}&mpfev=${mpfev}`, {
        headers: DEFAULT_HEADERS,
    });
    if (!response.ok) {
        throw new Error(`Category filters failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get latest sets for product lines
 */
export async function getLatestSets(productLineIds = '1,2,3,71,68,63,79,62,85') {
    const response = await fetch(`${BASE_URLS['mp-search-api']}/v1/product/latestsets/${productLineIds}`, {
        headers: DEFAULT_HEADERS,
    });
    if (!response.ok) {
        throw new Error(`Latest sets failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get detailed product listings with filters
 */
export async function getProductListings(productId, options = {}) {
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
    const response = await fetch(`${BASE_URLS['mp-search-api']}/v1/product/${productId}/listings`, {
        method: 'POST',
        headers: POST_HEADERS,
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        throw new Error(`Product listings failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get set information by set ID
 */
export async function getSetName(setId) {
    const response = await fetch(`${BASE_URLS.mpapi}/v2/Catalog/SetName/${setId}`, {
        headers: DEFAULT_HEADERS,
    });
    if (!response.ok) {
        throw new Error(`Set name failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get faceted product recommendations
 */
export async function getFacetedRecommendations(productIds, options = {}) {
    const { limit = 10 } = options;
    const response = await fetch(`${BASE_URLS.mpgateway}/v1/recommendation/faceted`, {
        method: 'POST',
        headers: POST_HEADERS,
        body: JSON.stringify({ productIds, limit }),
    });
    if (!response.ok) {
        throw new Error(`Faceted recommendations failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get active kickback promotions
 */
export async function getKickbacks() {
    const response = await fetch(`${BASE_URLS.mpapi}/v2/kickbacks?active=true`, {
        headers: DEFAULT_HEADERS,
    });
    if (!response.ok) {
        throw new Error(`Kickbacks failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get product attribute tags
 */
export async function getTags(domains = 'marketplace', classifications = 'product line affinity') {
    const params = new URLSearchParams({ domains, classifications });
    const response = await fetch(`${BASE_URLS['infinite-api']}/c/tags?${params}`, {
        headers: DEFAULT_HEADERS,
    });
    if (!response.ok) {
        throw new Error(`Tags failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get available game verticals
 */
export async function getVerticals() {
    const response = await fetch(`${BASE_URLS['infinite-api']}/c/verticals/`, {
        headers: DEFAULT_HEADERS,
    });
    if (!response.ok) {
        throw new Error(`Verticals failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get best-selling products
 */
export async function getBestsellers(options = {}) {
    const { categoryId = '3', limit = 20 } = options;
    const params = new URLSearchParams({ categoryId, limit: String(limit) });
    const response = await fetch(`${BASE_URLS['mp-search-api']}/v1/search/bestsellers?${params}`, {
        headers: DEFAULT_HEADERS,
    });
    if (!response.ok) {
        throw new Error(`Bestsellers failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get trending product suggestions
 */
export async function getTrending(options = {}) {
    const { productLine = 'Pokemon', limit = 10 } = options;
    const response = await fetch(`${BASE_URLS.data}/suggestions/trending`, {
        method: 'POST',
        headers: POST_HEADERS,
        body: JSON.stringify({ productLine, limit }),
    });
    if (!response.ok) {
        throw new Error(`Trending failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get catalog groups (TCG vs Tabletop categories)
 */
export async function getCatalogGroups() {
    const response = await fetch(`${BASE_URLS.mpapi}/v2/Catalog/CatalogGroups`, {
        headers: DEFAULT_HEADERS,
    });
    if (!response.ok) {
        throw new Error(`Catalog groups failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get free shipping threshold
 */
export async function getFreeShippingThreshold() {
    const response = await fetch(`${BASE_URLS.mpapi}/v2/param/freeshippingthreshold`, {
        headers: DEFAULT_HEADERS,
    });
    if (!response.ok) {
        throw new Error(`Free shipping threshold failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get available country codes for shipping
 */
export async function getCountryCodes() {
    const response = await fetch(`${BASE_URLS.mpapi}/v2/address/countryCodes`, {
        headers: DEFAULT_HEADERS,
    });
    if (!response.ok) {
        throw new Error(`Country codes failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get articles for a vertical
 */
export async function getArticles(options = {}) {
    const { vertical = 'pokemon', limit = 10 } = options;
    const params = new URLSearchParams({ vertical, limit: String(limit) });
    const response = await fetch(`${BASE_URLS['infinite-api']}/c/articles/?${params}`, {
        headers: DEFAULT_HEADERS,
    });
    if (!response.ok) {
        throw new Error(`Articles failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get trending articles
 */
export async function getTrendingArticles(options = {}) {
    const { limit = 10 } = options;
    const params = new URLSearchParams({ limit: String(limit) });
    const response = await fetch(`${BASE_URLS['infinite-api']}/content/articles/trending/?${params}`, {
        headers: DEFAULT_HEADERS,
    });
    if (!response.ok) {
        throw new Error(`Trending articles failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Get simplified product data from infinite-api
 */
export async function getInfiniteProduct(productId) {
    const response = await fetch(`${BASE_URLS['infinite-api']}/product/${productId}`, {
        headers: DEFAULT_HEADERS,
    });
    if (!response.ok) {
        throw new Error(`Infinite product failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Normalize a card name for consistent lookup
 */
export async function normalizeCardName(name) {
    const response = await fetch(`${BASE_URLS['infinite-api']}/card/normalize/${encodeURIComponent(name)}`, {
        headers: DEFAULT_HEADERS,
    });
    if (!response.ok) {
        throw new Error(`Normalize card name failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Search products with full details (convenience function)
 */
export async function searchProducts(query, options = {}) {
    return search({ q: query, ...options });
}
/**
 * Get full product info including details, sales, and price history
 */
export async function getProduct(productId) {
    const [details, sales, priceHistory] = await Promise.all([
        getProductDetails(productId),
        getLatestSales(productId),
        getPriceHistory(productId),
    ]);
    return { details, sales, priceHistory };
}
export default {
    autocomplete,
    search,
    getProductDetails,
    getLatestSales,
    getPriceHistory,
    getVolatility,
    getBuylistPrice,
    getSkuMarketPrices,
    getProductLines,
    getProductLineMappings,
    getCategoryFilters,
    getLatestSets,
    getProductListings,
    getSetName,
    getFacetedRecommendations,
    getKickbacks,
    getTags,
    getVerticals,
    getBestsellers,
    getTrending,
    getCatalogGroups,
    getFreeShippingThreshold,
    getCountryCodes,
    getArticles,
    getTrendingArticles,
    getInfiniteProduct,
    normalizeCardName,
    searchProducts,
    getProduct,
};
//# sourceMappingURL=server.js.map