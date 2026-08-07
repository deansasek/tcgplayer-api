/**
 * TCGplayer API Client
 */
import { TCGplayerClientOptions } from './types.js';
import { ProductsResource } from './resources/products.js';
import { SearchResource } from './resources/search.js';
import { PricingResource } from './resources/pricing.js';
import { CatalogResource } from './resources/catalog.js';
import { ContentResource } from './resources/content.js';
export declare class TCGplayerClient {
    readonly products: ProductsResource;
    readonly search: SearchResource;
    readonly pricing: PricingResource;
    readonly catalog: CatalogResource;
    readonly content: ContentResource;
    constructor(_options?: TCGplayerClientOptions);
}
//# sourceMappingURL=client.d.ts.map