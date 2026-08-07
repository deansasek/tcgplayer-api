/**
 * TCGplayer API Constants
 */
export declare const CONDITIONS: {
    readonly Unopened: 1;
    readonly Damaged: 2;
    readonly HeavilyPlayed: 3;
    readonly ModeratelyPlayed: 4;
    readonly LightlyPlayed: 5;
    readonly NearMint: 6;
    readonly Mint: 7;
};
export declare const PRICE_RANGES: readonly ["week", "month", "quarter", "year"];
export type ConditionKey = keyof typeof CONDITIONS;
export type PriceRange = typeof PRICE_RANGES[number];
export declare const BASE_URLS: {
    readonly data: "https://data.tcgplayer.com";
    readonly mpapi: "https://mpapi.tcgplayer.com";
    readonly 'mp-search-api': "https://mp-search-api.tcgplayer.com";
    readonly 'infinite-api': "https://infinite-api.tcgplayer.com";
    readonly mpgateway: "https://mpgateway.tcgplayer.com";
};
export declare const DEFAULT_HEADERS: {
    readonly 'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    readonly Accept: "application/json, text/plain, */*";
    readonly 'Accept-Language': "en-US,en;q=0.9";
    readonly 'Accept-Encoding': "gzip, deflate, br, zstd";
    readonly Origin: "https://www.tcgplayer.com";
    readonly Referer: "https://www.tcgplayer.com/";
    readonly 'Sec-GPC': "1";
    readonly Connection: "keep-alive";
    readonly 'Sec-Fetch-Mode': "cors";
    readonly 'Sec-Fetch-Site': "same-site";
};
export declare const POST_HEADERS: {
    readonly 'Content-Type': "application/json";
    readonly 'Sec-Fetch-Dest': "empty";
    readonly TE: "trailers";
    readonly 'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    readonly Accept: "application/json, text/plain, */*";
    readonly 'Accept-Language': "en-US,en;q=0.9";
    readonly 'Accept-Encoding': "gzip, deflate, br, zstd";
    readonly Origin: "https://www.tcgplayer.com";
    readonly Referer: "https://www.tcgplayer.com/";
    readonly 'Sec-GPC': "1";
    readonly Connection: "keep-alive";
    readonly 'Sec-Fetch-Mode': "cors";
    readonly 'Sec-Fetch-Site': "same-site";
};
export declare const DEFAULT_MPFEV = "5429";
//# sourceMappingURL=constants.d.ts.map