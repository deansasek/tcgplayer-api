/**
 * Content Resource
 */
import { Tag, KickbackPromotion, NormalizedCardName } from '../types.js';
export declare class ContentResource {
    articles(options?: {
        vertical?: string;
        limit?: number;
    }): Promise<unknown>;
    trendingArticles(options?: {
        limit?: number;
    }): Promise<unknown>;
    tags(options?: {
        domains?: string;
        classifications?: string;
    }): Promise<Tag[]>;
    kickbacks(options?: {
        active?: boolean;
    }): Promise<KickbackPromotion[]>;
    normalizeCardName(name: string): Promise<NormalizedCardName>;
}
//# sourceMappingURL=content.d.ts.map