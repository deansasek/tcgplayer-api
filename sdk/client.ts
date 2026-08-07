/**
 * TCGplayer API Client
 */

import { TCGplayerClientOptions } from './types.js';
import { ProductsResource } from './resources/products.js';
import { SearchResource } from './resources/search.js';
import { PricingResource } from './resources/pricing.js';
import { CatalogResource } from './resources/catalog.js';
import { ContentResource } from './resources/content.js';

export class TCGplayerClient {
  public readonly products: ProductsResource;
  public readonly search: SearchResource;
  public readonly pricing: PricingResource;
  public readonly catalog: CatalogResource;
  public readonly content: ContentResource;

  constructor(_options: TCGplayerClientOptions = {}) {
    this.products = new ProductsResource();
    this.search = new SearchResource();
    this.pricing = new PricingResource();
    this.catalog = new CatalogResource();
    this.content = new ContentResource();
  }
}
