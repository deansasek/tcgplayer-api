/**
 * Catalog Resource
 */
import { ProductLine, ProductLineMapping, CategoryFilter, SetNameResult, CatalogGroup, Vertical } from '../types.js';
export declare class CatalogResource {
    productLines(): Promise<ProductLine[]>;
    productLineMappings(productLine?: string, mpfev?: string): Promise<ProductLineMapping[]>;
    categoryFilters(categoryId?: string, mpfev?: string): Promise<CategoryFilter[]>;
    latestSets(productLineIds?: string): Promise<unknown>;
    setName(setId: number | string): Promise<SetNameResult>;
    catalogGroups(): Promise<CatalogGroup[]>;
    verticals(): Promise<Vertical[]>;
}
//# sourceMappingURL=catalog.d.ts.map