/**
 * TCGplayer REST API Wrapper
 *
 * Endpoints:
 * - Autocomplete:      https://data.tcgplayer.com/autocomplete
 * - Product Details:    https://mp-search-api.tcgplayer.com/v2/product/{id}/details
 * - Latest Sales:       https://mpapi.tcgplayer.com/v2/product/{id}/latestsales
 * - Price History:      https://infinite-api.tcgplayer.com/price/history/{id}/detailed
 * - Market Price:       https://mpgateway.tcgplayer.com/v1/pricepoints/marketprice/skus/{skuId}/volatility
 * - Buylist:            https://mpgateway.tcgplayer.com/v1/pricepoints/buylist/marketprice/products/{id}
 */

const BASE_URLS = {
  data: 'https://data.tcgplayer.com',
  mpapi: 'https://mpapi.tcgplayer.com',
  'mp-search-api': 'https://mp-search-api.tcgplayer.com',
  'infinite-api': 'https://infinite-api.tcgplayer.com',
  'mpgateway': 'https://mpgateway.tcgplayer.com',
};

const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:153.0) Gecko/20100101 Firefox/153.0',
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
 * Search products with full details (convenience function)
 * @param {string} query - Search query
 * @param {Object} options - Options
 * @returns {Promise<Object>} - Product with details and sales
 */
export async function searchProducts(query, options = {}) {
  const { productLine = 'Pokemon' } = options;

  // First get autocomplete results
  const products = await autocomplete(query, { productLine });

  // Filter out duplicates and products without IDs
  const uniqueProducts = products.filter(p => !p.duplicate && p['product-id']);

  // Get details for first 5 products
  const withDetails = await Promise.all(
    uniqueProducts.slice(0, 5).map(async (p) => {
      try {
        const details = await getProductDetails(p['product-id']);
        return { ...p, details };
      } catch {
        return p;
      }
    })
  );

  return withDetails;
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
  getProductDetails,
  getLatestSales,
  getPriceHistory,
  getVolatility,
  getBuylistPrice,
  searchProducts,
  getProduct,
};
