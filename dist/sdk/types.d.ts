/**
 * TCGplayer API Type Definitions
 */
export interface TCGplayerErrorResponse {
    errors: Array<{
        code: string;
        message: string;
    }>;
}
export interface TCGplayerApiError {
    status: number;
    endpoint: string;
    message: string;
}
export interface AutocompleteOptions {
    productLine?: string;
    sessionId?: string;
}
export interface SearchOptions {
    q?: string;
    productLine?: string;
    from?: number;
    size?: number;
    algorithm?: string;
    filters?: SearchFilters;
    sort?: SortOptions;
    shippingCountry?: string;
}
export interface SearchFilters {
    term?: Record<string, unknown>;
    range?: Record<string, unknown>;
    match?: Record<string, unknown>;
}
export interface SortOptions {
    field?: string;
    direction?: 'asc' | 'desc';
}
export interface LatestSalesOptions {
    mpfev?: string;
    conditions?: (number | string)[];
    languages?: (number | string)[];
    variants?: (number | string)[];
    listingType?: string;
    limit?: number;
}
export interface PriceHistoryOptions {
    range?: 'week' | 'month' | 'quarter' | 'year';
}
export interface ProductListingsOptions {
    sellerStatus?: string;
    channelId?: number;
    languages?: string[];
    conditions?: string[];
    quantityGte?: number;
}
export interface FacetedRecommendationsOptions {
    limit?: number;
}
export interface TagsOptions {
    domains?: string;
    classifications?: string;
}
export interface BestsellersOptions {
    categoryId?: string;
    limit?: number;
}
export interface TrendingOptions {
    productLine?: string;
    limit?: number;
}
export interface ArticlesOptions {
    vertical?: string;
    limit?: number;
}
export interface TrendingArticlesOptions {
    limit?: number;
}
export interface AutocompleteProduct {
    'product-name': string;
    'product-id': number;
    'set-name': string;
    rarityName: string;
    marketPrice: number;
}
export interface SearchResult {
    totalResults: number;
    aggregations: Record<string, unknown>;
    results: unknown[];
}
export interface ProductDetails {
    productName: string;
    marketPrice: number;
    rarityName: string;
    customAttributes: Record<string, unknown>;
    skus: unknown[];
    lowestPrice: number;
    sellers: number;
}
export interface SalesRecord {
    condition: string;
    variant: string;
    language: string;
    purchasePrice: number;
    shippingPrice: number;
    orderDate: string;
}
export interface LatestSalesResponse {
    data: SalesRecord[];
    totalResults: number;
}
export interface PriceBucket {
    marketPrice: number;
    quantitySold: number;
    lowSalePrice: number;
    highSalePrice: number;
    bucketStartDate: string;
}
export interface PriceHistoryResult {
    skuId: number;
    variant: string;
    buckets: PriceBucket[];
}
export interface PriceHistoryResponse {
    result: PriceHistoryResult[];
}
export interface VolatilityResponse {
    skuId: number;
    zScore: number;
    volatility: 'LOW' | 'MED' | 'HIGH';
}
export interface BuylistPriceRecord {
    skuId: number;
    marketPrice: number;
    highPrice: number;
    calculatedAt: string;
}
export interface SkuMarketPriceRecord {
    skuId: number;
    marketPrice: number;
    lowPrice?: number;
    highPrice?: number;
}
export interface ProductLine {
    productLineId: number;
    productLineName: string;
    productLineUrlName: string;
    isDirect: boolean;
}
export interface ProductLineMapping {
    fieldName: string;
    displayName: string;
    values: unknown[];
}
export interface CategoryFilter {
    categoryId: number;
    categoryName: string;
    displayName: string;
    urlName: string;
}
export interface LatestSet {
    categoryId: number;
    latestSets: Array<{
        setName: string;
        setNameId: number;
        cleanSetName: string;
        urlName: string;
        releaseDate: string;
    }>;
}
export interface ProductListing {
    sellerId: number;
    sellerName: string;
    condition: string;
    language: string;
    variant: string;
    price: number;
    quantity: number;
    shippingPrice: number;
}
export interface ProductListingsResponse {
    results: ProductListing[];
    totalResults: number;
}
export interface SetNameResult {
    setNameId: number;
    categoryId: number;
    name: string;
    cleanSetName: string;
    urlName: string;
}
export interface FacetedRecommendation {
    productId: number;
    productName: string;
    marketPrice: number;
    relevanceScore: number;
}
export interface KickbackPromotion {
    id: number;
    name: string;
    discountPercent: number;
    active: boolean;
    startDate: string;
    endDate: string;
}
export interface Tag {
    id: number;
    label: string;
    classification: string;
    domain: string;
}
export interface Vertical {
    verticalId: number;
    name: string;
    urlName: string;
}
export interface BestsellerProduct {
    productId: number;
    productName: string;
    setName: string;
    marketPrice: number;
    totalSold: number;
}
export interface TrendingSuggestion {
    productId: number;
    productName: string;
    marketPrice: number;
}
export interface CatalogGroup {
    catalogGroupId: number;
    catalogGroupName: string;
    urlName: string;
}
export interface CountryCode {
    code: string;
    countryName: string;
    isActive: number;
    isPostalCodeRequired: boolean;
    isStateRequired: boolean;
}
export interface Article {
    id: string;
    title: string;
    excerpt: string;
    contentType: string;
    date: string;
    author: string;
    imageUrl: string;
    url: string;
}
export interface ArticlesResponse {
    total: number;
    count: number;
    result: Article[];
}
export interface InfiniteProduct {
    id: string;
    name: string;
    productLine: string;
    tcgImageURL: string;
    tcgProductURL: string;
    marketPrice: number;
    lowestPrice: number;
    lowestPriceWithShipping: number;
    setName: string;
}
export interface NormalizedCardName {
    normalized: string;
}
export interface UserInfo {
    userName: string;
    nickname: string | null;
    userId: number;
    userKey: string;
    isSubscriber: boolean;
}
export interface DirectShippingInfo {
    isUserDirectEligible: boolean;
    directShippingThreshold: number | null;
}
export interface TCGplayerClientOptions {
    timeout?: number;
    userAgent?: string;
}
//# sourceMappingURL=types.d.ts.map