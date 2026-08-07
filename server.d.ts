/**
 * TCGplayer API Type Definitions
 */

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
  sort?: Record<string, unknown>;
  shippingCountry?: string;
}

export interface SearchFilters {
  term?: Record<string, string[]>;
  range?: Record<string, unknown>;
  match?: Record<string, unknown>;
}

export interface LatestSalesOptions {
  mpfev?: string;
  conditions?: number[];
  languages?: number[];
  variants?: number[];
  listingType?: string;
  limit?: number;
}

export interface PriceHistoryOptions {
  range?: 'week' | 'month' | 'quarter' | 'year';
}

export interface Product {
  details: ProductDetails;
  sales: LatestSalesResponse;
  priceHistory: PriceHistoryResponse;
}

export interface ProductDetails {
  productId: number;
  productName: string;
  setName: string;
  setCode: string;
  marketPrice: number;
  lowestPrice: number;
  rarityName: string;
  skus: SKU[];
  customAttributes: Record<string, unknown>;
  formattedAttributes: Record<string, string>;
}

export interface SKU {
  sku: number;
  condition: string;
  variant: string;
  language: string;
}

export interface LatestSalesResponse {
  data: Sale[];
  totalResults: number;
  resultCount: number;
}

export interface Sale {
  condition: string;
  variant: string;
  language: string;
  quantity: number;
  purchasePrice: number;
  shippingPrice: number;
  orderDate: string;
}

export interface PriceHistoryResponse {
  result: SKUPriceHistory[];
}

export interface SKUPriceHistory {
  skuId: number;
  variant: string;
  language: string;
  condition: string;
  buckets: PriceBucket[];
}

export interface PriceBucket {
  marketPrice: number;
  quantitySold: number;
  lowSalePrice: number;
  highSalePrice: number;
  bucketStartDate: string;
}

export interface VolatilityResponse {
  skuId: number;
  zScore: number;
  volatility: 'LOW' | 'MED' | 'HIGH';
}

export interface ProductLine {
  productLineId: number;
  productLineName: string;
  productLineUrlName: string;
  isDirect: boolean;
}

export interface ProductLineMapping {
  name: string;
  type: string;
  canonical: string;
}

export interface CategoryFilters {
  conditions: FilterOption[];
  languages: FilterOption[];
  variants: FilterOption[];
}

export interface FilterOption {
  value: string;
  count: number;
  isActive: boolean;
}

export interface SearchResponse {
  errors: unknown[];
  results: SearchResult[];
}

export interface SearchResult {
  totalResults: number;
  aggregations: Record<string, AggregationBucket[]>;
  results: SearchResultItem[];
}

export interface AggregationBucket {
  urlValue: string;
  value: string;
  count: number;
  isActive: boolean;
}

export interface SearchResultItem {
  productId: number;
  name: string;
  productName?: string;
  setName: string;
  rarityName: string;
  marketPrice: number;
  lowestPrice: number;
  imageCount?: number;
}

// Function signatures
export function autocomplete(query: string, options?: AutocompleteOptions): Promise<unknown[]>;

export function search(options: SearchOptions): Promise<SearchResponse>;

export function getProductDetails(productId: number | string, mpfev?: string): Promise<ProductDetails>;

export function getLatestSales(productId: number | string, options?: LatestSalesOptions): Promise<LatestSalesResponse>;

export function getPriceHistory(productId: number | string, options?: PriceHistoryOptions): Promise<PriceHistoryResponse>;

export function getVolatility(skuId: number | string, mpfev?: string): Promise<VolatilityResponse>;

export function getBuylistPrice(productId: number | string, mpfev?: string): Promise<unknown[]>;

export function getSkuMarketPrices(skuIds: number[], mpfev?: string): Promise<unknown[]>;

export function getProductLines(): Promise<ProductLine[]>;

export function getProductLineMappings(productLine?: string, mpfev?: string): Promise<ProductLineMapping[]>;

export function getCategoryFilters(categoryId?: string, mpfev?: string): Promise<CategoryFilters>;

export function getLatestSets(productLineIds?: string): Promise<unknown>;

export function searchProducts(query: string, options?: SearchOptions): Promise<SearchResponse>;

export function getProduct(productId: number | string): Promise<Product>;
