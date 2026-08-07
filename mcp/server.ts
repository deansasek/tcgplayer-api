import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import {
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
  getCatalogGroups,
  getFreeShippingThreshold,
  getCountryCodes,
  getArticles,
  getTrendingArticles,
  getInfiniteProduct,
  normalizeCardName,
  getProduct,
} from '../server.js';

/**
 * Create the MCP server
 */
const server = new Server(
  {
    name: 'tcgplayer-api-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'tcgplayer_autocomplete',
        description: 'Search for TCGplayer products by name',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query' },
            productLine: { type: 'string', description: 'Product line (default: Pokemon)' },
          },
          required: ['query'],
        },
      },
      {
        name: 'tcgplayer_search',
        description: 'Search TCGplayer products with filters and pagination',
        inputSchema: {
          type: 'object',
          properties: {
            q: { type: 'string', description: 'Search query' },
            productLine: { type: 'string', description: 'Product line (default: Pokemon)' },
            from: { type: 'number', description: 'Offset for pagination (default: 0)' },
            size: { type: 'number', description: 'Number of results (default: 24)' },
          },
        },
      },
      {
        name: 'tcgplayer_product',
        description: 'Get full product data including details, sales, and price history',
        inputSchema: {
          type: 'object',
          properties: {
            productId: { type: 'number', description: 'TCGplayer product ID' },
          },
          required: ['productId'],
        },
      },
      {
        name: 'tcgplayer_product_details',
        description: 'Get detailed product information',
        inputSchema: {
          type: 'object',
          properties: {
            productId: { type: 'number', description: 'TCGplayer product ID' },
          },
          required: ['productId'],
        },
      },
      {
        name: 'tcgplayer_latest_sales',
        description: 'Get recent sales data for a product',
        inputSchema: {
          type: 'object',
          properties: {
            productId: { type: 'number', description: 'TCGplayer product ID' },
            conditions: { type: 'array', items: { type: 'number' }, description: 'Condition filters (1=Unopened, 2=Damaged, 3=HeavilyPlayed, 4=ModeratelyPlayed, 5=LightlyPlayed, 6=NearMint, 7=Mint)' },
            languages: { type: 'array', items: { type: 'number' }, description: 'Language filters (1=English)' },
            limit: { type: 'number', description: 'Results limit (default: 25)' },
          },
          required: ['productId'],
        },
      },
      {
        name: 'tcgplayer_price_history',
        description: 'Get historical pricing data',
        inputSchema: {
          type: 'object',
          properties: {
            productId: { type: 'number', description: 'TCGplayer product ID' },
            range: { type: 'string', enum: ['week', 'month', 'quarter', 'year'], description: 'Time range (default: quarter)' },
          },
          required: ['productId'],
        },
      },
      {
        name: 'tcgplayer_volatility',
        description: 'Get market volatility for a SKU',
        inputSchema: {
          type: 'object',
          properties: {
            skuId: { type: 'number', description: 'TCGplayer SKU ID' },
          },
          required: ['skuId'],
        },
      },
      {
        name: 'tcgplayer_buylist_price',
        description: 'Get buylist/market prices for a product',
        inputSchema: {
          type: 'object',
          properties: {
            productId: { type: 'number', description: 'TCGplayer product ID' },
          },
          required: ['productId'],
        },
      },
      {
        name: 'tcgplayer_sku_market_prices',
        description: 'Get market prices for multiple SKUs',
        inputSchema: {
          type: 'object',
          properties: {
            skuIds: { type: 'array', items: { type: 'number' }, description: 'Array of SKU IDs' },
          },
          required: ['skuIds'],
        },
      },
      {
        name: 'tcgplayer_category_filters',
        description: 'Get available filter options (conditions, languages, variants) for a category',
        inputSchema: {
          type: 'object',
          properties: {
            categoryId: { type: 'string', description: 'Category ID (default: 3 for Pokemon, 1 for Magic)' },
          },
        },
      },
      {
        name: 'tcgplayer_product_lines',
        description: 'Get all available product lines',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'tcgplayer_product_line_mappings',
        description: 'Get filter field mappings for a product line',
        inputSchema: {
          type: 'object',
          properties: {
            productLine: { type: 'string', description: 'Product line name (default: Pokemon)' },
          },
        },
      },
      {
        name: 'tcgplayer_latest_sets',
        description: 'Get latest sets for product lines',
        inputSchema: {
          type: 'object',
          properties: {
            productLineIds: { type: 'string', description: 'Comma-separated product line IDs' },
          },
        },
      },
      {
        name: 'tcgplayer_product_listings',
        description: 'Get detailed product listings with filters',
        inputSchema: {
          type: 'object',
          properties: {
            productId: { type: 'number', description: 'TCGplayer product ID' },
            sellerStatus: { type: 'string', description: 'Seller status filter (default: Live)' },
            languages: { type: 'array', items: { type: 'string' }, description: 'Language filters' },
            conditions: { type: 'array', items: { type: 'string' }, description: 'Condition filters' },
            quantityGte: { type: 'number', description: 'Minimum quantity (default: 1)' },
          },
          required: ['productId'],
        },
      },
      {
        name: 'tcgplayer_set_name',
        description: 'Get set information by set ID',
        inputSchema: {
          type: 'object',
          properties: {
            setId: { type: 'number', description: 'TCGplayer set ID' },
          },
          required: ['setId'],
        },
      },
      {
        name: 'tcgplayer_recommendations',
        description: 'Get faceted product recommendations based on product IDs',
        inputSchema: {
          type: 'object',
          properties: {
            productIds: { type: 'array', items: { type: 'number' }, description: 'Array of product IDs' },
            limit: { type: 'number', description: 'Max recommendations (default: 10)' },
          },
          required: ['productIds'],
        },
      },
      {
        name: 'tcgplayer_kickbacks',
        description: 'Get active kickback promotions',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'tcgplayer_tags',
        description: 'Get product attribute tags for filtering',
        inputSchema: {
          type: 'object',
          properties: {
            domains: { type: 'string', description: 'Domain filter (default: marketplace)' },
            classifications: { type: 'string', description: 'Classification filter (default: product line affinity)' },
          },
        },
      },
      {
        name: 'tcgplayer_verticals',
        description: 'Get available game verticals',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'tcgplayer_bestsellers',
        description: 'Get best-selling products for a category',
        inputSchema: {
          type: 'object',
          properties: {
            categoryId: { type: 'string', description: 'Category ID (default: 3 for Pokemon)' },
            limit: { type: 'number', description: 'Results limit (default: 20)' },
          },
        },
      },
      {
        name: 'tcgplayer_trending',
        description: 'Get trending product suggestions',
        inputSchema: {
          type: 'object',
          properties: {
            productLine: { type: 'string', description: 'Product line (default: Pokemon)' },
            limit: { type: 'number', description: 'Results limit (default: 10)' },
          },
        },
      },
      {
        name: 'tcgplayer_catalog_groups',
        description: 'Get catalog groups (TCG vs Tabletop categories)',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'tcgplayer_free_shipping_threshold',
        description: 'Get minimum order amount for free shipping',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'tcgplayer_country_codes',
        description: 'Get available country codes for shipping',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'tcgplayer_articles',
        description: 'Get articles for a vertical',
        inputSchema: {
          type: 'object',
          properties: {
            vertical: { type: 'string', description: 'Vertical name (default: pokemon)' },
            limit: { type: 'number', description: 'Results limit (default: 10)' },
          },
        },
      },
      {
        name: 'tcgplayer_trending_articles',
        description: 'Get trending articles',
        inputSchema: {
          type: 'object',
          properties: {
            limit: { type: 'number', description: 'Results limit (default: 10)' },
          },
        },
      },
      {
        name: 'tcgplayer_infinite_product',
        description: 'Get simplified product data from infinite-api',
        inputSchema: {
          type: 'object',
          properties: {
            productId: { type: 'number', description: 'TCGplayer product ID' },
          },
          required: ['productId'],
        },
      },
      {
        name: 'tcgplayer_normalize_card_name',
        description: 'Normalize a card name for consistent lookup',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Card name to normalize' },
          },
          required: ['name'],
        },
      },
    ],
  };
});

/**
 * Handle tool calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    switch (name) {
      case 'tcgplayer_autocomplete': {
        const results = await autocomplete(args.query as string, {
          productLine: (args.productLine as string) || 'Pokemon',
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_search': {
        const results = await search({
          q: (args.q as string) || '',
          productLine: (args.productLine as string) || 'Pokemon',
          from: (args.from as number) || 0,
          size: (args.size as number) || 24,
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_product': {
        const results = await getProduct(args.productId as number);
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_product_details': {
        const results = await getProductDetails(args.productId as number);
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_latest_sales': {
        const results = await getLatestSales(args.productId as number, {
          conditions: (args.conditions as (number | string)[]) || [],
          languages: (args.languages as (number | string)[]) || [1],
          limit: (args.limit as number) || 25,
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_price_history': {
        const results = await getPriceHistory(args.productId as number, {
          range: (args.range as string) || 'quarter',
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_volatility': {
        const results = await getVolatility(args.skuId as number);
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_buylist_price': {
        const results = await getBuylistPrice(args.productId as number);
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_sku_market_prices': {
        const results = await getSkuMarketPrices(args.skuIds as number[]);
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_category_filters': {
        const results = await getCategoryFilters((args.categoryId as string) || '3');
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_product_lines': {
        const results = await getProductLines();
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_product_line_mappings': {
        const results = await getProductLineMappings((args.productLine as string) || 'Pokemon');
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_latest_sets': {
        const results = await getLatestSets(args.productLineIds as string);
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_product_listings': {
        const results = await getProductListings(args.productId as number, {
          sellerStatus: (args.sellerStatus as string) || 'Live',
          languages: (args.languages as string[]) || ['English'],
          conditions: (args.conditions as string[]) || [],
          quantityGte: (args.quantityGte as number) || 1,
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_set_name': {
        const results = await getSetName(args.setId as number);
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_recommendations': {
        const results = await getFacetedRecommendations(args.productIds as number[], {
          limit: (args.limit as number) || 10,
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_kickbacks': {
        const results = await getKickbacks();
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_tags': {
        const results = await getTags((args.domains as string) || 'marketplace', (args.classifications as string) || 'product line affinity');
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_verticals': {
        const results = await getVerticals();
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_bestsellers': {
        const results = await getBestsellers({
          categoryId: (args.categoryId as string) || '3',
          limit: (args.limit as number) || 20,
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_trending': {
        const results = await getTrending({
          productLine: (args.productLine as string) || 'Pokemon',
          limit: (args.limit as number) || 10,
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_catalog_groups': {
        const results = await getCatalogGroups();
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_free_shipping_threshold': {
        const results = await getFreeShippingThreshold();
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_country_codes': {
        const results = await getCountryCodes();
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_articles': {
        const results = await getArticles({
          vertical: (args.vertical as string) || 'pokemon',
          limit: (args.limit as number) || 10,
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_trending_articles': {
        const results = await getTrendingArticles({
          limit: (args.limit as number) || 10,
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_infinite_product': {
        const results = await getInfiniteProduct(args.productId as number);
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_normalize_card_name': {
        const results = await normalizeCardName(args.name as string);
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      default:
        return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
    }
  } catch (error) {
    return { content: [{ type: 'text', text: `Error: ${(error as Error).message}` }], isError: true };
  }
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('TCGplayer MCP server started');
}

main().catch(console.error);
