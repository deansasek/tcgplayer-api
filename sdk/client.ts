/**
 * TCGplayer API Client
 *
 * @example
 * import { TCGplayerClient } from './sdk/client.js';
 *
 * const client = new TCGplayerClient();
 * const results = await client.search.autocomplete('pikachu');
 * const product = await client.products.details(704874);
 */
import { TCGplayerClientOptions } from './types.js';
import { ProductsResource } from './resources/products.js';
import { SearchResource } from './resources/search.js';
import { PricingResource } from './resources/pricing.js';
import { CatalogResource } from './resources/catalog.js';
import { ContentResource } from './resources/content.js';

/**
 * Main client for interacting with the TCGplayer API.
 *
 * Provides typed access to products, search, pricing, catalog, and content resources.
 *
 * @example
 * const client = new TCGplayerClient();
 * const card = await client.products.details(704874);
 * const results = await client.search.autocomplete('charizard');
 */
export class TCGplayerClient {
  /** Product methods: details, listings, sales, priceHistory, volatility, buylistPrice, infinite, recommendations */
  public readonly products: ProductsResource;
  /** Search methods: autocomplete, fullSearch, bestsellers, trending */
  public readonly search: SearchResource;
  /** Pricing methods: skuMarketPrices */
  public readonly pricing: PricingResource;
  /** Catalog methods: productLines, categoryFilters, latestSets, setName, catalogGroups, verticals, countryCodes */
  public readonly catalog: CatalogResource;
  /** Content methods: articles, trendingArticles, tags, kickbacks, normalizeCardName */
  public readonly content: ContentResource;

  /**
   * Create a new TCGplayer API client.
   * @param options - Optional configuration options
   * @param options.timeout - Request timeout in milliseconds (default: 30000)
   * @param options.userAgent - Custom user agent string
   */
  constructor(_options: TCGplayerClientOptions = {}) {
    this.products = new ProductsResource();
    this.search = new SearchResource();
    this.pricing = new PricingResource();
    this.catalog = new CatalogResource();
    this.content = new ContentResource();
  }
}
