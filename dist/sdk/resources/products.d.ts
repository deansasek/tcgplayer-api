/**
 * Products Resource
 */
import { ProductDetails, LatestSalesOptions, LatestSalesResponse, PriceHistoryOptions, PriceHistoryResponse, VolatilityResponse, BuylistPriceRecord, ProductListingsOptions, ProductListingsResponse, InfiniteProduct } from '../types.js';
export declare class ProductsResource {
    details(productId: number | string): Promise<ProductDetails>;
    listings(productId: number | string, options?: ProductListingsOptions): Promise<ProductListingsResponse>;
    sales(productId: number | string, options?: LatestSalesOptions): Promise<LatestSalesResponse>;
    priceHistory(productId: number | string, options?: PriceHistoryOptions): Promise<PriceHistoryResponse>;
    volatility(skuId: number | string, mpfev?: string): Promise<VolatilityResponse>;
    buylistPrice(productId: number | string, mpfev?: string): Promise<BuylistPriceRecord[]>;
    infinite(productId: number | string): Promise<InfiniteProduct>;
}
//# sourceMappingURL=products.d.ts.map