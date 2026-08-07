/**
 * TCGplayer REST API Wrapper
 *
 * Base URLs:
 * - data.tcgplayer.com      - Autocomplete
 * - mpapi.tcgplayer.com     - Sales data
 * - mp-search-api.tcgplayer.com - Search, product details, categories
 * - infinite-api.tcgplayer.com - Price history
 * - mpgateway.tcgplayer.com - Pricing data
 */

/**
 * Condition filter values for getLatestSales
 */
export const CONDITIONS = {
  Unopened: 1,
  Damaged: 2,
  HeavilyPlayed: 3,
  ModeratelyPlayed: 4,
  LightlyPlayed: 5,
  NearMint: 6,
  Mint: 7,
};

/**
 * Price range options for getPriceHistory
 */
export const PRICE_RANGES = ['week', 'month', 'quarter', 'year'];

const BASE_URLS = {
  data: 'https://data.tcgplayer.com',
  mpapi: 'https://mpapi.tcgplayer.com',
  'mp-search-api': 'https://mp-search-api.tcgplayer.com',
  'infinite-api': 'https://infinite-api.tcgplayer.com',
  mpgateway: 'https://mpgateway.tcgplayer.com',
};

const DEFAULT_HEADERS = {
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
};

const POST_HEADERS = {
  ...DEFAULT_HEADERS,
  'Content-Type': 'application/json',
  'Sec-Fetch-Dest': 'empty',
  'TE': 'trailers',
};

/**
 * Generate a session ID for autocomplete requests
 */
function generateSessionId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Search for products using autocomplete
 * @param {string} query - Search query
 * @param {Object} options - Options
 * @param {string} options.productLine - Product line (Pokemon, Magic, etc.)
 * @param {string} options.sessionId - Session ID (auto-generated if not provided)
 * @returns {Promise<Array>} - Array of product suggestions
 */
export async function autocomplete(query, options = {}) {
  const { productLine = 'Pokemon', sessionId = generateSessionId() } = options;

  const params = new URLSearchParams({
    q: query,
    'session-id': sessionId,
    'product-line-affinity': productLine,
    algorithm: 'product_line_affinity',
  });

  const response = await fetch(`${BASE_URLS.data}/autocomplete?${params}`, {
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`Autocomplete failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.products || [];
}

/**
 * Search products with full filtering, sorting, and pagination
 * @param {Object} options - Search options
 * @param {string} options.q - Search query
 * @param {string} options.productLine - Product line name (default: 'Pokemon')
 * @param {number} options.from - Offset for pagination (default: 0)
 * @param {number} options.size - Number of results (default: 24)
 * @param {string} options.algorithm - Search algorithm (default: 'sales_dismax')
 * @param {Object} options.filters - Additional filters
 * @param {Object} options.sort - Sort options
 * @param {string} options.shippingCountry - Shipping country (default: 'US')
 * @returns {Promise<Object>} - Search results with aggregations
 */
export async function search(options = {}) {
  const {
    q = '',
    productLine = 'Pokemon',
    from = 0,
    size = 24,
    algorithm = 'sales_dismax',
    filters = {},
    sort = {},
    shippingCountry = 'US',
  } = options;

  const body = {
    algorithm,
    from,
    size,
    filters: {
      term: {
        productLineName: [productLine],
        ...filters.term,
      },
      range: filters.range || {},
      match: filters.match || {},
    },
    listingSearch: {
      context: { cart: { packages: {} } },
      filters: {
        term: { sellerStatus: 'Live', channelId: 0 },
        range: { quantity: { gte: 1 } },
        exclude: { channelExclusion: 0 },
      },
    },
    context: {
      cart: { packages: {} },
      shippingCountry,
      userProfile: {},
    },
    settings: {
      useFuzzySearch: true,
      didYouMean: {},
    },
    sort,
  };

  const response = await fetch(`${BASE_URLS['mp-search-api']}/v1/search/request?q=${encodeURIComponent(q)}&isList=false&mpfev=5429`, {
    method: 'POST',
    headers: POST_HEADERS,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get detailed product information
 * @param {number|string} productId - TCGplayer product ID
 * @param {string} mpfev - MPF event ID (default: 5429)
 * @returns {Promise<Object>} - Product details
 */
export async function getProductDetails(productId, mpfev = '5429') {
  const response = await fetch(`${BASE_URLS['mp-search-api']}/v2/product/${productId}/details?mpfev=${mpfev}`, {
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`Product details failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get latest sales for a product
 * @param {number|string} productId - TCGplayer product ID
 * @param {Object} options - Options
 * @param {string} options.mpfev - MPF event ID (default: 5429)
 * @param {Array} options.conditions - Condition filters (default: all)
 * @param {Array} options.languages - Language filters (default: [1] for English)
 * @param {Array} options.variants - Variant filters
 * @param {string} options.listingType - Listing type (default: "All")
 * @param {number} options.limit - Results limit (default: 25)
 * @returns {Promise<Object>} - Sales data
 */
export async function getLatestSales(productId, options = {}) {
  const {
    mpfev = '5429',
    conditions = [],
    languages = [1],
    variants = [],
    listingType = 'All',
    limit = 25,
  } = options;

  const response = await fetch(`${BASE_URLS.mpapi}/v2/product/${productId}/latestsales?mpfev=${mpfev}`, {
    method: 'POST',
    headers: POST_HEADERS,
    body: JSON.stringify({ conditions, languages, variants, listingType, limit }),
  });

  if (!response.ok) {
    throw new Error(`Latest sales failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get price history for a product
 * @param {number|string} productId - TCGplayer product ID
 * @param {Object} options - Options
 * @param {string} options.range - Time range: 'week', 'month', 'quarter', 'year' (default: 'quarter')
 * @returns {Promise<Object>} - Price history data
 */
export async function getPriceHistory(productId, options = {}) {
  const { range = 'quarter' } = options;

  const pageRequestId = `${Date.now()}:www.tcgplayer.com/product/${productId}`;

  const response = await fetch(`${BASE_URLS['infinite-api']}/price/history/${productId}/detailed?range=${range}`, {
    headers: {
      ...DEFAULT_HEADERS,
      'Accept': '*/*',
      'X-PageRequest-ID': pageRequestId,
    },
  });

  if (!response.ok) {
    throw new Error(`Price history failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get market price volatility for a SKU
 * @param {number|string} skuId - TCGplayer SKU ID
 * @param {string} mpfev - MPF event ID (default: 5429)
 * @returns {Promise<Object>} - Volatility data
 */
export async function getVolatility(skuId, mpfev = '5429') {
  const response = await fetch(`${BASE_URLS.mpgateway}/v1/pricepoints/marketprice/skus/${skuId}/volatility?mpfev=${mpfev}`, {
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`Volatility failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get buylist prices for a product
 * @param {number|string} productId - TCGplayer product ID
 * @param {string} mpfev - MPF event ID (default: 5429)
 * @returns {Promise<Array>} - Buylist price data
 */
export async function getBuylistPrice(productId, mpfev = '5429') {
  const response = await fetch(`${BASE_URLS.mpgateway}/v1/pricepoints/buylist/marketprice/products/${productId}?mpfev=${mpfev}`, {
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`Buylist failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get market prices for multiple SKUs at once
 * @param {Array<number>} skuIds - Array of SKU IDs
 * @param {string} mpfev - MPF event ID (default: 5429)
 * @returns {Promise<Array>} - Market price data for SKUs
 */
export async function getSkuMarketPrices(skuIds, mpfev = '5429') {
  const response = await fetch(`${BASE_URLS.mpgateway}/v1/pricepoints/marketprice/skus/search?mpfev=${mpfev}`, {
    method: 'POST',
    headers: POST_HEADERS,
    body: JSON.stringify({ skuIds }),
  });

  if (!response.ok) {
    throw new Error(`SKU market prices failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get available product lines/categories
 * @returns {Promise<Array>} - List of product lines
 */
export async function getProductLines() {
  const response = await fetch(`${BASE_URLS['mp-search-api']}/v1/search/productLines`, {
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`Product lines failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get search filter field mappings for a product line
 * @param {string} productLine - Product line name (default: 'Pokemon')
 * @param {string} mpfev - MPF event ID (default: 5429)
 * @returns {Promise<Array>} - Filter field mappings
 */
export async function getProductLineMappings(productLine = 'Pokemon', mpfev = '5429') {
  const response = await fetch(`${BASE_URLS['mp-search-api']}/v1/search/productLineMappings?productLine=${encodeURIComponent(productLine)}&mpfev=${mpfev}`, {
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`Product line mappings failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get category filters for a product line
 * @param {number|string} categoryId - Category ID (default: 3 for Pokemon)
 * @param {string} mpfev - MPF event ID (default: 5429)
 * @returns {Promise<Array>} - Category filters
 */
export async function getCategoryFilters(categoryId = '3', mpfev = '5429') {
  const response = await fetch(`${BASE_URLS['mp-search-api']}/v1/product/categoryfilters?categoryId=${categoryId}&mpfev=${mpfev}`, {
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`Category filters failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get latest sets for product lines
 * @param {string} productLineIds - Comma-separated product line IDs (default: '1,2,3,71,68,63,79,62,85')
 * @returns {Promise<Object>} - Latest sets data
 */
export async function getLatestSets(productLineIds = '1,2,3,71,68,63,79,62,85') {
  const response = await fetch(`${BASE_URLS['mp-search-api']}/v1/product/latestsets/${productLineIds}`, {
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`Latest sets failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get detailed product listings with filters
 * @param {number|string} productId - TCGplayer product ID
 * @param {Object} options - Options
 * @param {string} options.sellerStatus - Seller status filter (default: 'Live')
 * @param {number} options.channelId - Channel ID filter (default: 0)
 * @param {Array} options.languages - Language filters (default: ['English'])
 * @param {Array} options.conditions - Condition filters
 * @param {number} options.quantityGte - Minimum quantity (default: 1)
 * @returns {Promise<Object>} - Product listings
 */
export async function getProductListings(productId, options = {}) {
  const {
    sellerStatus = 'Live',
    channelId = 0,
    languages = ['English'],
    conditions = [],
    quantityGte = 1,
  } = options;

  const body = {
    filters: {
      term: {
        sellerStatus,
        channelId,
        ...(languages.length ? { language: languages } : {}),
        ...(conditions.length ? { condition: conditions } : {}),
      },
      range: { quantity: { gte: quantityGte } },
    },
  };

  const response = await fetch(`${BASE_URLS['mp-search-api']}/v1/product/${productId}/listings`, {
    method: 'POST',
    headers: POST_HEADERS,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Product listings failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get set information by set ID
 * @param {number|string} setId - TCGplayer set ID
 * @returns {Promise<Object>} - Set information
 */
export async function getSetName(setId) {
  const response = await fetch(`${BASE_URLS.mpapi}/v2/Catalog/SetName/${setId}`, {
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`Set name failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get faceted product recommendations
 * @param {Array<number>} productIds - Array of product IDs
 * @param {Object} options - Options
 * @param {number} options.limit - Max recommendations (default: 10)
 * @returns {Promise<Object>} - Recommendations
 */
export async function getFacetedRecommendations(productIds, options = {}) {
  const { limit = 10 } = options;

  const response = await fetch(`${BASE_URLS.mpgateway}/v1/recommendation/faceted`, {
    method: 'POST',
    headers: POST_HEADERS,
    body: JSON.stringify({ productIds, limit }),
  });

  if (!response.ok) {
    throw new Error(`Faceted recommendations failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get active kickback promotions
 * @returns {Promise<Object>} - Kickback promotions
 */
export async function getKickbacks() {
  const response = await fetch(`${BASE_URLS.mpapi}/v2/kickbacks?active=true`, {
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`Kickbacks failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get product attribute tags
 * @param {string} domains - Domain filter (default: 'marketplace')
 * @param {string} classifications - Classification filter (default: 'product line affinity')
 * @returns {Promise<Object>} - Tags data
 */
export async function getTags(domains = 'marketplace', classifications = 'product line affinity') {
  const params = new URLSearchParams({ domains, classifications });

  const response = await fetch(`${BASE_URLS['infinite-api']}/c/tags?${params}`, {
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`Tags failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get available game verticals
 * @returns {Promise<Object>} - Verticals data
 */
export async function getVerticals() {
  const response = await fetch(`${BASE_URLS['infinite-api']}/c/verticals/`, {
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`Verticals failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get best-selling products
 * @param {Object} options - Options
 * @param {string} options.categoryId - Category ID (default: '3' for Pokemon)
 * @param {number} options.limit - Results limit (default: 20)
 * @returns {Promise<Object>} - Bestsellers data
 */
export async function getBestsellers(options = {}) {
  const { categoryId = '3', limit = 20 } = options;

  const params = new URLSearchParams({ categoryId, limit: String(limit) });

  const response = await fetch(`${BASE_URLS['mp-search-api']}/v1/search/bestsellers?${params}`, {
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`Bestsellers failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get trending product suggestions
 * @param {Object} options - Options
 * @param {string} options.productLine - Product line (default: 'Pokemon')
 * @param {number} options.limit - Results limit (default: 10)
 * @returns {Promise<Object>} - Trending suggestions
 */
export async function getTrending(options = {}) {
  const { productLine = 'Pokemon', limit = 10 } = options;

  const response = await fetch(`${BASE_URLS.data}/suggestions/trending`, {
    method: 'POST',
    headers: POST_HEADERS,
    body: JSON.stringify({ productLine, limit }),
  });

  if (!response.ok) {
    throw new Error(`Trending failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Search products with full details (convenience function)
 * @param {string} query - Search query
 * @param {Object} options - Options
 * @returns {Promise<Object>} - Search results
 */
export async function searchProducts(query, options = {}) {
  return search({ q: query, ...options });
}

/**
 * Get full product info including details, sales, and price history
 * @param {number|string} productId - TCGplayer product ID
 * @returns {Promise<Object>} - Complete product data
 */
export async function getProduct(productId) {
  const [details, sales, priceHistory] = await Promise.all([
    getProductDetails(productId),
    getLatestSales(productId),
    getPriceHistory(productId),
  ]);

  return { details, sales, priceHistory };
}

export default {
  autocomplete,
  search,
  getProductDetails,
  getLatestSales,
  getPriceHistory,
  getVolatility,
  getBuylistPrice,
  getSkuMarketPrices,
  getProductLines,
  getProductLineMappings,
  getCategoryFilters,
  getLatestSets,
  getProductListings,
  getSetName,
  getFacetedRecommendations,
  getKickbacks,
  getTags,
  getVerticals,
  getBestsellers,
  getTrending,
  searchProducts,
  getProduct,
};
