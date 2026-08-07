/**
 * Search Resource
 */
import { SearchOptions, AutocompleteProduct, TrendingSuggestion } from '../types.js';
export declare class SearchResource {
    autocomplete(query: string, options?: {
        productLine?: string;
        sessionId?: string;
    }): Promise<AutocompleteProduct[]>;
    fullSearch(options?: SearchOptions): Promise<unknown>;
    bestsellers(options?: {
        categoryId?: string;
        limit?: number;
    }): Promise<unknown>;
    trending(options?: {
        productLine?: string;
        limit?: number;
    }): Promise<{
        products?: TrendingSuggestion[];
    }>;
}
//# sourceMappingURL=search.d.ts.map