/**
 * TCGplayer API Client
 */
import { ProductsResource } from './resources/products.js';
import { SearchResource } from './resources/search.js';
import { PricingResource } from './resources/pricing.js';
import { CatalogResource } from './resources/catalog.js';
import { ContentResource } from './resources/content.js';
export class TCGplayerClient {
    products;
    search;
    pricing;
    catalog;
    content;
    constructor(_options = {}) {
        this.products = new ProductsResource();
        this.search = new SearchResource();
        this.pricing = new PricingResource();
        this.catalog = new CatalogResource();
        this.content = new ContentResource();
    }
}
//# sourceMappingURL=client.js.map