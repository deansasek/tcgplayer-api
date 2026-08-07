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
import type { SearchOptions } from './sdk/types.js';
export { CONDITIONS, PRICE_RANGES, BASE_URLS } from './sdk/constants.js';
export type { TCGplayerClientOptions, AutocompleteOptions, LatestSalesOptions, PriceHistoryOptions, ProductListingsOptions, FacetedRecommendationsOptions, TagsOptions, BestsellersOptions, TrendingOptions, ArticlesOptions, TrendingArticlesOptions, } from './sdk/types.js';
/**
 * Search for products using autocomplete
 */
export declare function autocomplete(query: string, options?: {
    productLine?: string;
    sessionId?: string;
}): Promise<unknown[]>;
/**
 * Search products with full filtering, sorting, and pagination
 */
export declare function search(options?: SearchOptions): Promise<unknown>;
/**
 * Get detailed product information
 */
export declare function getProductDetails(productId: number | string, mpfev?: string): Promise<unknown>;
/**
 * Get latest sales for a product
 */
export declare function getLatestSales(productId: number | string, options?: {
    mpfev?: string;
    conditions?: (number | string)[];
    languages?: (number | string)[];
    variants?: (number | string)[];
    listingType?: string;
    limit?: number;
}): Promise<unknown>;
/**
 * Get price history for a product
 */
export declare function getPriceHistory(productId: number | string, options?: {
    range?: string;
}): Promise<unknown>;
/**
 * Get market price volatility for a SKU
 */
export declare function getVolatility(skuId: number | string, mpfev?: string): Promise<unknown>;
/**
 * Get buylist prices for a product
 */
export declare function getBuylistPrice(productId: number | string, mpfev?: string): Promise<unknown>;
/**
 * Get market prices for multiple SKUs at once
 */
export declare function getSkuMarketPrices(skuIds: number[], mpfev?: string): Promise<unknown>;
/**
 * Get available product lines/categories
 */
export declare function getProductLines(): Promise<unknown>;
/**
 * Get search filter field mappings for a product line
 */
export declare function getProductLineMappings(productLine?: string, mpfev?: string): Promise<unknown>;
/**
 * Get category filters for a product line
 */
export declare function getCategoryFilters(categoryId?: string, mpfev?: string): Promise<unknown>;
/**
 * Get latest sets for product lines
 */
export declare function getLatestSets(productLineIds?: string): Promise<unknown>;
/**
 * Get detailed product listings with filters
 */
export declare function getProductListings(productId: number | string, options?: {
    sellerStatus?: string;
    channelId?: number;
    languages?: string[];
    conditions?: string[];
    quantityGte?: number;
}): Promise<unknown>;
/**
 * Get set information by set ID
 */
export declare function getSetName(setId: number | string): Promise<unknown>;
/**
 * Get faceted product recommendations
 */
export declare function getFacetedRecommendations(productIds: number[], options?: {
    limit?: number;
}): Promise<unknown>;
/**
 * Get active kickback promotions
 */
export declare function getKickbacks(): Promise<unknown>;
/**
 * Get product attribute tags
 */
export declare function getTags(domains?: string, classifications?: string): Promise<unknown>;
/**
 * Get available game verticals
 */
export declare function getVerticals(): Promise<unknown>;
/**
 * Get best-selling products
 */
export declare function getBestsellers(options?: {
    categoryId?: string;
    limit?: number;
}): Promise<unknown>;
/**
 * Get trending product suggestions
 */
export declare function getTrending(options?: {
    productLine?: string;
    limit?: number;
}): Promise<unknown>;
/**
 * Get catalog groups (TCG vs Tabletop categories)
 */
export declare function getCatalogGroups(): Promise<unknown>;
/**
 * Get free shipping threshold
 */
export declare function getFreeShippingThreshold(): Promise<unknown>;
/**
 * Get available country codes for shipping
 */
export declare function getCountryCodes(): Promise<unknown>;
/**
 * Get articles for a vertical
 */
export declare function getArticles(options?: {
    vertical?: string;
    limit?: number;
}): Promise<unknown>;
/**
 * Get trending articles
 */
export declare function getTrendingArticles(options?: {
    limit?: number;
}): Promise<unknown>;
/**
 * Get simplified product data from infinite-api
 */
export declare function getInfiniteProduct(productId: number | string): Promise<unknown>;
/**
 * Normalize a card name for consistent lookup
 */
export declare function normalizeCardName(name: string): Promise<unknown>;
/**
 * Search products with full details (convenience function)
 */
export declare function searchProducts(query: string, options?: SearchOptions): Promise<unknown>;
/**
 * Get full product info including details, sales, and price history
 */
export declare function getProduct(productId: number | string): Promise<{
    details: unknown;
    sales: unknown;
    priceHistory: unknown;
}>;
declare const _default: {
    autocomplete: typeof autocomplete;
    search: typeof search;
    getProductDetails: typeof getProductDetails;
    getLatestSales: typeof getLatestSales;
    getPriceHistory: typeof getPriceHistory;
    getVolatility: typeof getVolatility;
    getBuylistPrice: typeof getBuylistPrice;
    getSkuMarketPrices: typeof getSkuMarketPrices;
    getProductLines: typeof getProductLines;
    getProductLineMappings: typeof getProductLineMappings;
    getCategoryFilters: typeof getCategoryFilters;
    getLatestSets: typeof getLatestSets;
    getProductListings: typeof getProductListings;
    getSetName: typeof getSetName;
    getFacetedRecommendations: typeof getFacetedRecommendations;
    getKickbacks: typeof getKickbacks;
    getTags: typeof getTags;
    getVerticals: typeof getVerticals;
    getBestsellers: typeof getBestsellers;
    getTrending: typeof getTrending;
    getCatalogGroups: typeof getCatalogGroups;
    getFreeShippingThreshold: typeof getFreeShippingThreshold;
    getCountryCodes: typeof getCountryCodes;
    getArticles: typeof getArticles;
    getTrendingArticles: typeof getTrendingArticles;
    getInfiniteProduct: typeof getInfiniteProduct;
    normalizeCardName: typeof normalizeCardName;
    searchProducts: typeof searchProducts;
    getProduct: typeof getProduct;
};
export default _default;
//# sourceMappingURL=server.d.ts.map