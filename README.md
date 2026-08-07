# TCGplayer API

A REST API wrapper for [TCGplayer](https://www.tcgplayer.com/) providing structured access to trading card data including Pokemon, Magic: The Gathering, and other TCGs.

> **Disclaimer:** This wrapper is an unofficial tool created for educational purposes only. It is not affiliated with, maintained, or endorsed by TCGplayer. Use of this wrapper may violate TCGplayer's terms of service.

## Overview

The TCGplayer API provides programmatic access to card market data, enabling:
- Product search with autocomplete suggestions
- Detailed product information including prices, attributes, and images
- Recent sales data with condition and variant filters
- Historical price tracking (week/month/quarter/year)
- Market volatility metrics
- Buylist/market pricing

## Installation

```bash
npm install
```

## Quick Start

```javascript
import { autocomplete, getProduct, getLatestSales } from './server.js';

// Search for a card
const results = await autocomplete('morpeko', { productLine: 'Pokemon' });

// Get full product data
const product = await getProduct(704874);
// Returns: { details, sales, priceHistory }
```

## API Functions

### autocomplete(query, options)

Search for products by name.

```javascript
const results = await autocomplete('charizard', { productLine: 'Pokemon' });
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | string | Search query |
| `options.productLine` | string | Product line (default: 'Pokemon') |
| `options.sessionId` | string | Session ID (auto-generated if not provided) |

**Returns:** Array of product suggestions with `product-name`, `product-id`, `set-name`, `rarityName`, `marketPrice`.

### search(options)

Full search with filters, sorting, and pagination.

```javascript
const results = await search({
  q: 'charizard',
  productLine: 'Pokemon',
  from: 0,
  size: 24,
  sort: { field: 'marketPrice', direction: 'asc' }
});
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `q` | string | `''` | Search query |
| `productLine` | string | `'Pokemon'` | Product line name |
| `from` | integer | `0` | Offset for pagination |
| `size` | integer | `24` | Number of results |
| `sort` | object | `{}` | Sort field and direction |

**Returns:** `{ results: [{ totalResults, aggregations, results: [...] }] }`

The `aggregations` object contains filter options: `cardType`, `energyType`, `rarityName`, `setName`, `condition`, `language`, `printing`.

### getProductDetails(productId, mpfev?)

Get full product information.

```javascript
const details = await getProductDetails(704874);
```

**Returns:** Object with `productName`, `marketPrice`, `rarityName`, `customAttributes`, `skus`, `lowestPrice`, `sellers`.

### getLatestSales(productId, options)

Get recent sales data.

```javascript
const sales = await getLatestSales(productId, {
  conditions: [],
  languages: [1],
  variants: [],
  listingType: 'All',
  limit: 25
});
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `conditions` | array | `[]` | Condition filter (see below) |
| `languages` | array | `[1]` | Language filter (1 = English) |
| `variants` | array | `[]` | Variant filter |
| `listingType` | string | `'All'` | Listing type |
| `limit` | integer | `25` | Results limit |

**Condition values:** `1` = Unopened, `2` = Damaged, `3` = Heavily Played, `4` = Moderately Played, `5` = Lightly Played, `6` = Near Mint, `7` = Mint

**Returns:** `{ data: [{ condition, variant, language, purchasePrice, shippingPrice, orderDate }], totalResults }`

### getPriceHistory(productId, options)

Get historical pricing data.

```javascript
const history = await getPriceHistory(704874, { range: 'quarter' });
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `range` | string | `'quarter'` | Time range: `week`, `month`, `quarter`, `year` |

**Returns:** `{ result: [{ skuId, variant, buckets: [{ marketPrice, quantitySold, lowSalePrice, highSalePrice, bucketStartDate }] }] }`

### getVolatility(skuId, mpfev?)

Get market volatility for a SKU.

```javascript
const vol = await getVolatility(9399752);
```

**Returns:** `{ skuId, zScore, volatility }` where volatility is `LOW`, `MED`, or `HIGH`.

### getBuylistPrice(productId, mpfev?)

Get buylist/market prices.

```javascript
const buylist = await getBuylistPrice(704874);
```

**Returns:** `[{ skuId, marketPrice, highPrice, calculatedAt }]`

### getProduct(productId)

Convenience function that fetches details, sales, and price history in one call.

```javascript
const product = await getProduct(704874);
// Returns: { details, sales, priceHistory }
```

### getProductListings(productId, options)

Get detailed seller listings with filters.

```javascript
const listings = await getProductListings(704874, {
  languages: ['English'],
  conditions: ['Near Mint'],
  quantityGte: 1
});
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `sellerStatus` | string | `'Live'` | Seller status filter |
| `languages` | array | `['English']` | Language filters |
| `conditions` | array | `[]` | Condition filters |
| `quantityGte` | integer | `1` | Minimum quantity |

### getSetName(setId)

Get set information by set ID.

```javascript
const set = await getSetName(1234);
```

### getFacetedRecommendations(productIds, options)

Get related product recommendations.

```javascript
const recs = await getFacetedRecommendations([704874, 12345], { limit: 10 });
```

### getKickbacks()

Get active kickback promotions.

```javascript
const kickbacks = await getKickbacks();
```

### getTags(domains?, classifications?)

Get product attribute tags for filtering.

```javascript
const tags = await getTags();
```

### getVerticals()

Get available game verticals.

```javascript
const verticals = await getVerticals();
```

### getBestsellers(options)

Get best-selling products for a category.

```javascript
const bestsellers = await getBestsellers({ categoryId: '3', limit: 20 });
```

### getTrending(options)

Get trending product suggestions.

```javascript
const trending = await getTrending({ productLine: 'Pokemon', limit: 10 });
```

### getCatalogGroups()

Get catalog groups (TCG vs Tabletop categories).

```javascript
const groups = await getCatalogGroups();
```

### getFreeShippingThreshold()

Get minimum order amount for free shipping.

```javascript
const threshold = await getFreeShippingThreshold();
```

### getCountryCodes()

Get available country codes for shipping.

```javascript
const codes = await getCountryCodes();
```

### getArticles(options)

Get articles for a vertical.

```javascript
const articles = await getArticles({ vertical: 'pokemon', limit: 10 });
```

### getTrendingArticles(options)

Get trending articles.

```javascript
const trending = await getTrendingArticles({ limit: 10 });
```

### getInfiniteProduct(productId)

Get simplified product data from infinite-api.

```javascript
const product = await getInfiniteProduct(704874);
```

### normalizeCardName(name)

Normalize a card name for consistent lookup.

```javascript
const normalized = await normalizeCardName('Morpeko ex');
// Returns: { normalized: 'morpeko_ex' }
```

## Product Line Options

```javascript
autocomplete('pikachu', { productLine: 'Pokemon' });      // Pokemon cards
autocomplete('fireball', { productLine: 'Magic' });       // Magic: The Gathering
autocomplete('gundam', { productLine: 'Gundam Card Game' });
```

## Internal API Endpoints

| Function | Endpoint | Method |
|----------|----------|--------|
| `autocomplete` | `https://data.tcgplayer.com/autocomplete` | GET |
| `search` | `https://mp-search-api.tcgplayer.com/v1/search/request` | POST |
| `getProductDetails` | `https://mp-search-api.tcgplayer.com/v2/product/{id}/details` | GET |
| `getLatestSales` | `https://mpapi.tcgplayer.com/v2/product/{id}/latestsales` | POST |
| `getPriceHistory` | `https://infinite-api.tcgplayer.com/price/history/{id}/detailed` | GET |
| `getVolatility` | `https://mpgateway.tcgplayer.com/v1/pricepoints/marketprice/skus/{skuId}/volatility` | GET |
| `getBuylistPrice` | `https://mpgateway.tcgplayer.com/v1/pricepoints/buylist/marketprice/products/{id}` | GET |
| `getSkuMarketPrices` | `https://mpgateway.tcgplayer.com/v1/pricepoints/marketprice/skus/search` | POST |
| `getProductLines` | `https://mp-search-api.tcgplayer.com/v1/search/productLines` | GET |
| `getProductLineMappings` | `https://mp-search-api.tcgplayer.com/v1/search/productLineMappings` | GET |
| `getCategoryFilters` | `https://mp-search-api.tcgplayer.com/v1/product/categoryfilters` | GET |
| `getLatestSets` | `https://mp-search-api.tcgplayer.com/v1/product/latestsets/{ids}` | GET |
| `getProductListings` | `https://mp-search-api.tcgplayer.com/v1/product/{id}/listings` | POST |
| `getSetName` | `https://mpapi.tcgplayer.com/v2/Catalog/SetName/{setId}` | GET |
| `getFacetedRecommendations` | `https://mpgateway.tcgplayer.com/v1/recommendation/faceted` | POST |
| `getKickbacks` | `https://mpapi.tcgplayer.com/v2/kickbacks?active=true` | GET |
| `getTags` | `https://infinite-api.tcgplayer.com/c/tags` | GET |
| `getVerticals` | `https://infinite-api.tcgplayer.com/c/verticals/` | GET |
| `getBestsellers` | `https://mp-search-api.tcgplayer.com/v1/search/bestsellers` | GET |
| `getTrending` | `https://data.tcgplayer.com/suggestions/trending` | POST |
| `getCatalogGroups` | `https://mpapi.tcgplayer.com/v2/Catalog/CatalogGroups` | GET |
| `getFreeShippingThreshold` | `https://mpapi.tcgplayer.com/v2/param/freeshippingthreshold` | GET |
| `getCountryCodes` | `https://mpapi.tcgplayer.com/v2/address/countryCodes` | GET |
| `getArticles` | `https://infinite-api.tcgplayer.com/c/articles/` | GET |
| `getTrendingArticles` | `https://infinite-api.tcgplayer.com/content/articles/trending/` | GET |
| `getInfiniteProduct` | `https://infinite-api.tcgplayer.com/product/{id}` | GET |
| `normalizeCardName` | `https://infinite-api.tcgplayer.com/card/normalize/{name}` | GET |

## MCP Server (Claude Code Integration)

This package includes an MCP (Model Context Protocol) server for use with Claude Code, enabling Claude to interact with TCGplayer data directly.

### Installation

The MCP server is configured in `.mcp.json`:

```json
{
  "mcpServers": {
    "tcgplayer-api-mcp": {
      "command": "node",
      "args": ["./mcp/server.js"]
    }
  }
}
```

Claude Code will automatically detect and use MCP servers defined in `.mcp.json`.

### Available MCP Tools

| Tool | Description |
|------|-------------|
| `tcgplayer_autocomplete` | Search for TCGplayer products by name |
| `tcgplayer_search` | Search products with filters and pagination |
| `tcgplayer_product` | Get full product data (details, sales, price history) |
| `tcgplayer_product_details` | Get detailed product information |
| `tcgplayer_latest_sales` | Get recent sales data for a product |
| `tcgplayer_price_history` | Get historical pricing data |
| `tcgplayer_volatility` | Get market volatility for a SKU |
| `tcgplayer_buylist_price` | Get buylist/market prices for a product |
| `tcgplayer_category_filters` | Get available filter options (conditions, languages, variants) |
| `tcgplayer_product_lines` | Get all available product lines |
| `tcgplayer_latest_sets` | Get latest sets for product lines |
| `tcgplayer_product_listings` | Get detailed product listings with filters |
| `tcgplayer_set_name` | Get set information by set ID |
| `tcgplayer_recommendations` | Get faceted product recommendations |
| `tcgplayer_kickbacks` | Get active kickback promotions |
| `tcgplayer_tags` | Get product attribute tags for filtering |
| `tcgplayer_verticals` | Get available game verticals |
| `tcgplayer_bestsellers` | Get best-selling products for a category |
| `tcgplayer_trending` | Get trending product suggestions |
| `tcgplayer_catalog_groups` | Get catalog groups (TCG vs Tabletop categories) |
| `tcgplayer_free_shipping_threshold` | Get minimum order for free shipping |
| `tcgplayer_country_codes` | Get available country codes for shipping |
| `tcgplayer_articles` | Get articles for a vertical |
| `tcgplayer_trending_articles` | Get trending articles |
| `tcgplayer_infinite_product` | Get simplified product data from infinite-api |
| `tcgplayer_normalize_card_name` | Normalize a card name for consistent lookup |

### Usage Examples

```
User: Search for Morpeko cards on TCGplayer
Claude uses: tcgplayer_search with q="morpeko"

User: Get the latest sales for product 704874
Claude uses: tcgplayer_latest_sales with productId=704874

User: What conditions and languages are available for Pokemon?
Claude uses: tcgplayer_category_filters with categoryId="3"
```

## Examples

### Complete Card Analysis

```javascript
import { getProduct } from './server.js';

async function analyzeCard(productId) {
  const { details, sales, priceHistory } = await getProduct(productId);

  console.log(`Product: ${details.productName}`);
  console.log(`Set: ${details.setName}`);
  console.log(`Market Price: $${details.marketPrice}`);
  console.log(`Lowest Price: $${details.lowestPrice}`);
  console.log(`Sellers: ${details.sellers}`);

  if (sales.data.length > 0) {
    const lastSale = sales.data[0];
    console.log(`Last Sale: $${lastSale.purchasePrice} (${lastSale.condition})`);
  }

  return { details, sales, priceHistory };
}

analyzeCard(704874); // Morpeko ex
```

### Track Price Movements

```javascript
import { getPriceHistory } from './server.js';

const history = await getPriceHistory(704874, { range: 'month' });
const nmHolofoil = history.result[0];

console.log('Recent price buckets:');
nmHolofoil.buckets.slice(0, 4).forEach(bucket => {
  console.log(`${bucket.bucketStartDate}: $${bucket.marketPrice} (${bucket.quantitySold} sold)`);
});
```

## Environment

- **Node.js** 14+ required
- No external dependencies (uses native fetch)

## License

This project is dedicated to the public domain under the [Unlicense](./LICENSE).
