# TCGplayer API

> **Disclaimer:** This wrapper is an unofficial tool created for educational purposes only. It is not affiliated with, maintained, or endorsed by TCGplayer. Use of this wrapper may violate TCGplayer's terms of service.

A REST API wrapper for [TCGplayer](https://www.tcgplayer.com/) providing structured access to trading card data including Pokemon, Magic: The Gathering, and other TCGs.

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
| `tcg_autocomplete` | Search for TCGplayer products by name |
| `tcg_search` | Search products with filters and pagination |
| `tcg_product` | Get full product data (details, sales, price history) |
| `tcg_product_details` | Get detailed product information |
| `tcg_latest_sales` | Get recent sales data for a product |
| `tcg_price_history` | Get historical pricing data |
| `tcg_volatility` | Get market volatility for a SKU |
| `tcg_buylist_price` | Get buylist/market prices for a product |
| `tcg_category_filters` | Get available filter options (conditions, languages, variants) |
| `tcg_product_lines` | Get all available product lines |
| `tcg_latest_sets` | Get latest sets for product lines |

### Usage Examples

```
User: Search for Morpeko cards on TCGplayer
Claude uses: tcg_search with q="morpeko"

User: Get the latest sales for product 704874
Claude uses: tcg_latest_sales with productId=704874

User: What conditions and languages are available for Pokemon?
Claude uses: tcg_category_filters with categoryId="3"
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
