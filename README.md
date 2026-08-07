# TCGplayer API

A TypeScript-first SDK and REST API wrapper for [TCGplayer](https://www.tcgplayer.com/) providing structured access to trading card data including Pokemon, Magic: The Gathering, and other TCGs — with an MCP server for Claude Code integration.

> **Disclaimer:** This wrapper is an unofficial tool created for educational purposes only. It is not affiliated with, maintained, or endorsed by TCGplayer. Use of this wrapper may violate TCGplayer's terms of service.

## Installation

```bash
npm install
npm run build
```

## SDK (Recommended)

The SDK provides a typed, class-based interface organized by resource.

```typescript
import { TCGplayerClient } from 'tcgplayer-api/sdk';

const client = new TCGplayerClient();

// Search
const results = await client.search.autocomplete('morpeko');

// Product details
const product = await client.products.details(704874);

// Price history
const history = await client.products.priceHistory(704874, { range: 'quarter' });
```

### SDK Resources

| Resource | Methods |
|----------|---------|
| `client.products` | `details()`, `listings()`, `sales()`, `priceHistory()`, `volatility()`, `buylistPrice()`, `infinite()` |
| `client.search` | `autocomplete()`, `fullSearch()`, `bestsellers()`, `trending()` |
| `client.pricing` | `skuMarketPrices()` |
| `client.catalog` | `productLines()`, `categoryFilters()`, `latestSets()`, `setName()`, `catalogGroups()`, `verticals()` |
| `client.content` | `articles()`, `trendingArticles()`, `tags()`, `kickbacks()`, `normalizeCardName()` |

### SDK Example: Card Analysis

```typescript
import { TCGplayerClient } from 'tcgplayer-api/sdk';

const client = new TCGplayerClient();

async function analyzeCard(productId: number) {
  const [details, sales, history] = await Promise.all([
    client.products.details(productId),
    client.products.sales(productId),
    client.products.priceHistory(productId, { range: 'month' }),
  ]);

  console.log(`${details.productName} (${details.setName})`);
  console.log(`Market Price: $${details.marketPrice}`);
  console.log(`Sellers: ${details.sellers}`);

  if (sales.data.length > 0) {
    const last = sales.data[0];
    console.log(`Last Sale: $${last.purchasePrice} (${last.condition})`);
  }

  return { details, sales, history };
}

analyzeCard(704874); // Morpeko ex
```

---

## REST API (Backward Compatible)

Flat function exports for direct API access.

```typescript
import { autocomplete, getProduct } from 'tcgplayer-api';
```

### autocomplete(query, options?)

Search for products by name.

```typescript
const results = await autocomplete('charizard', { productLine: 'Pokemon' });
```

### search(options?)

Full search with filters, sorting, and pagination.

```typescript
const results = await search({
  q: 'charizard',
  productLine: 'Pokemon',
  from: 0,
  size: 24,
});
```

### getProduct(productId)

Convenience function combining details, sales, and price history.

```typescript
const product = await getProduct(704874);
// Returns: { details, sales, priceHistory }
```

### Other Functions

| Function | Description |
|----------|-------------|
| `getProductDetails(id)` | Full product information |
| `getLatestSales(id, options?)` | Recent sales with filters |
| `getPriceHistory(id, options?)` | Historical pricing (`range: week\|month\|quarter\|year`) |
| `getVolatility(skuId)` | Market volatility for a SKU |
| `getBuylistPrice(id)` | Buylist/market prices |
| `getSkuMarketPrices(skuIds)` | Bulk SKU pricing |
| `getProductListings(id, options?)` | Detailed seller listings |
| `getProductLines()` | All available product lines |
| `getCategoryFilters(categoryId?)` | Filter options for a category |
| `getLatestSets(productLineIds?)` | Latest sets |
| `getSetName(setId)` | Set information |
| `getFacetedRecommendations(productIds, options?)` | Related products |
| `getKickbacks()` | Active promotions |
| `getTags()` | Product attribute tags |
| `getVerticals()` | Game verticals |
| `getBestsellers(options?)` | Best-selling products |
| `getTrending(options?)` | Trending suggestions |
| `getCatalogGroups()` | TCG vs Tabletop categories |
| `getFreeShippingThreshold()` | Free shipping minimum |
| `getCountryCodes()` | Shipping country list |
| `getArticles(options?)` | Articles by vertical |
| `getTrendingArticles(options?)` | Trending articles |
| `getInfiniteProduct(id)` | Simplified product data |
| `normalizeCardName(name)` | Normalize card name |

### Condition Values

| Value | Condition |
|-------|-----------|
| 1 | Unopened |
| 2 | Damaged |
| 3 | Heavily Played |
| 4 | Moderately Played |
| 5 | Lightly Played |
| 6 | Near Mint |
| 7 | Mint |

---

## MCP Server (Claude Code Integration)

The MCP server enables Claude Code to interact with TCGplayer data directly.

### Installation

Claude Code automatically detects `.mcp.json`:

```json
{
  "mcpServers": {
    "tcgplayer-api-mcp": {
      "command": "npx",
      "args": ["tsx", "mcp/server.ts"]
    }
  }
}
```

### Available MCP Tools

| Tool | Description |
|------|-------------|
| `tcgplayer_autocomplete` | Search for products by name |
| `tcgplayer_search` | Search with filters and pagination |
| `tcgplayer_product` | Full product data (details, sales, price history) |
| `tcgplayer_product_details` | Detailed product information |
| `tcgplayer_latest_sales` | Recent sales data |
| `tcgplayer_price_history` | Historical pricing data |
| `tcgplayer_volatility` | Market volatility for a SKU |
| `tcgplayer_buylist_price` | Buylist/market prices |
| `tcgplayer_category_filters` | Filter options (conditions, languages, variants) |
| `tcgplayer_product_lines` | All available product lines |
| `tcgplayer_latest_sets` | Latest sets for product lines |
| `tcgplayer_product_listings` | Detailed seller listings |
| `tcgplayer_set_name` | Set information by set ID |
| `tcgplayer_recommendations` | Faceted product recommendations |
| `tcgplayer_kickbacks` | Active kickback promotions |
| `tcgplayer_tags` | Product attribute tags |
| `tcgplayer_verticals` | Available game verticals |
| `tcgplayer_bestsellers` | Best-selling products |
| `tcgplayer_trending` | Trending product suggestions |
| `tcgplayer_catalog_groups` | Catalog groups (TCG vs Tabletop) |
| `tcgplayer_free_shipping_threshold` | Free shipping minimum |
| `tcgplayer_country_codes` | Shipping country codes |
| `tcgplayer_articles` | Articles for a vertical |
| `tcgplayer_trending_articles` | Trending articles |
| `tcgplayer_infinite_product` | Simplified product data |
| `tcgplayer_normalize_card_name` | Normalize card name |

### MCP Usage Examples

```
User: Search for Morpeko cards
Claude uses: tcgplayer_search with q="morpeko"

User: Get latest sales for product 704874
Claude uses: tcgplayer_latest_sales with productId=704874

User: What conditions are available for Pokemon?
Claude uses: tcgplayer_category_filters with categoryId="3"
```

---

## Development

```bash
npm run build    # Compile TypeScript
npm run clean   # Remove dist folder
npm run dev     # Run server.ts directly
npm run mcp     # Run MCP server directly
```

---

## Environment

- **Node.js** 18+ recommended (uses native fetch)
- TypeScript with strict mode
- ES Modules (`type: "module"`)

---

## License

This project is dedicated to the public domain under the [Unlicense](./LICENSE).
