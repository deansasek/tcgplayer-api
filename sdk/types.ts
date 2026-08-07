/**
 * TCGplayer API Type Definitions
 */

// Shared types

/** API error response format from TCGplayer */
export interface TCGplayerErrorResponse {
  errors: Array<{ code: string; message: string }>;
}

/** Structured error object for API failures */
export interface TCGplayerApiError {
  status: number;
  endpoint: string;
  message: string;
}

// Request options

/** Options for autocomplete searches */
export interface AutocompleteOptions {
  productLine?: string;
  sessionId?: string;
}

/** Options for full-text search */
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

/** Filter structure for search queries */
export interface SearchFilters {
  term?: Record<string, unknown>;
  range?: Record<string, unknown>;
  match?: Record<string, unknown>;
}

/** Sort options for search results */
export interface SortOptions {
  field?: string;
  direction?: 'asc' | 'desc';
}

/** Options for latest sales queries */
export interface LatestSalesOptions {
  mpfev?: string;
  conditions?: (number | string)[];
  languages?: (number | string)[];
  variants?: (number | string)[];
  listingType?: string;
  limit?: number;
}

/** Options for price history queries */
export interface PriceHistoryOptions {
  range?: 'week' | 'month' | 'quarter' | 'year';
}

/** Options for product listings queries */
export interface ProductListingsOptions {
  sellerStatus?: string;
  channelId?: number;
  languages?: string[];
  conditions?: string[];
  quantityGte?: number;
}

/** Options for faceted recommendations */
export interface FacetedRecommendationsOptions {
  limit?: number;
}

/** Options for tag queries */
export interface TagsOptions {
  domains?: string;
  classifications?: string;
}

/** Options for bestsellers queries */
export interface BestsellersOptions {
  categoryId?: string;
  limit?: number;
}

/** Options for trending queries */
export interface TrendingOptions {
  productLine?: string;
  limit?: number;
}

/** Options for article queries */
export interface ArticlesOptions {
  vertical?: string;
  limit?: number;
}

/** Options for trending article queries */
export interface TrendingArticlesOptions {
  limit?: number;
}

// Response types

/** Autocomplete search result item */
export interface AutocompleteProduct {
  'product-name': string;
  'product-id': number;
  'set-name': string;
  rarityName: string;
  marketPrice: number;
}

/** Full search result wrapper */
export interface SearchResult {
  totalResults: number;
  aggregations: Record<string, unknown>;
  results: unknown[];
}

/** Detailed product information */
export interface ProductDetails {
  productName: string;
  marketPrice: number;
  rarityName: string;
  customAttributes: Record<string, unknown>;
  skus: unknown[];
  lowestPrice: number;
  sellers: number;
}

/** Individual sales record */
export interface SalesRecord {
  condition: string;
  variant: string;
  language: string;
  purchasePrice: number;
  shippingPrice: number;
  orderDate: string;
}

/** Response from latest sales endpoint */
export interface LatestSalesResponse {
  data: SalesRecord[];
  totalResults: number;
}

/** Single price bucket in price history */
export interface PriceBucket {
  marketPrice: number;
  quantitySold: number;
  lowSalePrice: number;
  highSalePrice: number;
  bucketStartDate: string;
}

/** Price history result for a single SKU */
export interface PriceHistoryResult {
  skuId: number;
  variant: string;
  buckets: PriceBucket[];
}

/** Response from price history endpoint */
export interface PriceHistoryResponse {
  result: PriceHistoryResult[];
}

/** Volatility response for a SKU */
export interface VolatilityResponse {
  skuId: number;
  zScore: number;
  volatility: 'LOW' | 'MED' | 'HIGH';
}

/** Buylist price record for a product */
export interface BuylistPriceRecord {
  skuId: number;
  marketPrice: number;
  highPrice: number;
  calculatedAt: string;
}

/** Market price record for a SKU */
export interface SkuMarketPriceRecord {
  skuId: number;
  marketPrice: number;
  lowPrice?: number;
  highPrice?: number;
}

/** Product line (e.g., Pokemon, Magic: The Gathering) */
export interface ProductLine {
  productLineId: number;
  productLineName: string;
  productLineUrlName: string;
  isDirect: boolean;
}

/** Filter field mapping for a product line */
export interface ProductLineMapping {
  fieldName: string;
  displayName: string;
  values: unknown[];
}

/** Category filter option */
export interface CategoryFilter {
  categoryId: number;
  categoryName: string;
  displayName: string;
  urlName: string;
}

/** Latest set information for a category */
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

/** Individual product listing from a seller */
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

/** Response from product listings endpoint */
export interface ProductListingsResponse {
  results: ProductListing[];
  totalResults: number;
}

/** Set name and metadata by set ID */
export interface SetNameResult {
  setNameId: number;
  categoryId: number;
  name: string;
  cleanSetName: string;
  urlName: string;
}

/** Faceted recommendation item */
export interface FacetedRecommendation {
  productId: number;
  productName: string;
  marketPrice: number;
  relevanceScore: number;
}

/** Active kickback promotion */
export interface KickbackPromotion {
  id: number;
  name: string;
  discountPercent: number;
  active: boolean;
  startDate: string;
  endDate: string;
}

/** Product attribute tag */
export interface Tag {
  id: number;
  label: string;
  classification: string;
  domain: string;
}

/** Game vertical (e.g., pokemon, magic, yugioh) */
export interface Vertical {
  verticalId: number;
  name: string;
  urlName: string;
}

/** Bestseller product item */
export interface BestsellerProduct {
  productId: number;
  productName: string;
  setName: string;
  marketPrice: number;
  totalSold: number;
}

/** Trending suggestion item */
export interface TrendingSuggestion {
  term: string;
  score: number;
}

/** Catalog group (TCG vs Tabletop) */
export interface CatalogGroup {
  catalogGroupId: number;
  catalogGroupName: string;
  urlName: string;
}

/** Country code for shipping */
export interface CountryCode {
  code: string;
  countryName: string;
  isActive: number;
  isPostalCodeRequired: boolean;
  isStateRequired: boolean;
}

/** Article/content post */
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

/** Response from articles endpoint */
export interface ArticlesResponse {
  total: number;
  count: number;
  result: Article[];
}

/** Simplified product from infinite-api (includes image URL) */
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

/** Normalized card name result */
export interface NormalizedCardName {
  normalized: string;
}

/** User profile information */
export interface UserInfo {
  userName: string;
  nickname: string | null;
  userId: number;
  userKey: string;
  isSubscriber: boolean;
}

/** Direct shipping eligibility */
export interface DirectShippingInfo {
  isUserDirectEligible: boolean;
  directShippingThreshold: number | null;
}

/** TCGplayerClient configuration options */
export interface TCGplayerClientOptions {
  timeout?: number;
  userAgent?: string;
}
