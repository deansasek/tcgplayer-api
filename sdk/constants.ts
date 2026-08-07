/**
 * TCGplayer API Constants
 */

export const CONDITIONS = {
  Unopened: 1,
  Damaged: 2,
  HeavilyPlayed: 3,
  ModeratelyPlayed: 4,
  LightlyPlayed: 5,
  NearMint: 6,
  Mint: 7,
} as const;

export const PRICE_RANGES = ['week', 'month', 'quarter', 'year'] as const;

export type ConditionKey = keyof typeof CONDITIONS;
export type PriceRange = typeof PRICE_RANGES[number];

export const BASE_URLS = {
  data: 'https://data.tcgplayer.com',
  mpapi: 'https://mpapi.tcgplayer.com',
  'mp-search-api': 'https://mp-search-api.tcgplayer.com',
  'infinite-api': 'https://infinite-api.tcgplayer.com',
  mpgateway: 'https://mpgateway.tcgplayer.com',
} as const;

export const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Origin': 'https://www.tcgplayer.com',
  'Referer': 'https://www.tcgplayer.com/',
  'Sec-GPC': '1',
  'Connection': 'keep-alive',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-site',
} as const;

export const POST_HEADERS = {
  ...DEFAULT_HEADERS,
  'Content-Type': 'application/json',
  'Sec-Fetch-Dest': 'empty',
  'TE': 'trailers',
} as const;

export const DEFAULT_MPFEV = '5429';
