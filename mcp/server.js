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
        name: 'tcg_autocomplete',
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
        name: 'tcg_search',
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
        name: 'tcg_product',
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
        name: 'tcg_product_details',
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
        name: 'tcg_latest_sales',
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
        name: 'tcg_price_history',
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
        name: 'tcg_volatility',
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
        name: 'tcg_buylist_price',
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
        name: 'tcg_product_lines',
        description: 'Get all available product lines',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'tcg_latest_sets',
        description: 'Get latest sets for product lines',
        inputSchema: {
          type: 'object',
          properties: {
            productLineIds: { type: 'string', description: 'Comma-separated product line IDs' },
          },
        },
      },
    ],
  };
});

/**
 * Handle tool calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'tcg_autocomplete': {
        const results = await autocomplete(args.query, {
          productLine: args.productLine || 'Pokemon',
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcg_search': {
        const results = await search({
          q: args.q || '',
          productLine: args.productLine || 'Pokemon',
          from: args.from || 0,
          size: args.size || 24,
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcg_product': {
        const results = await getProduct(args.productId);
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcg_product_details': {
        const results = await getProductDetails(args.productId);
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcg_latest_sales': {
        const results = await getLatestSales(args.productId, {
          conditions: args.conditions || [],
          languages: args.languages || [1],
          limit: args.limit || 25,
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcg_price_history': {
        const results = await getPriceHistory(args.productId, {
          range: args.range || 'quarter',
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcg_volatility': {
        const results = await getVolatility(args.skuId);
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcg_buylist_price': {
        const results = await getBuylistPrice(args.productId);
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcg_product_lines': {
        const results = await getProductLines();
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcg_latest_sets': {
        const results = await getLatestSets(args.productLineIds);
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      default:
        return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
    }
  } catch (error) {
    return { content: [{ type: 'text', text: `Error: ${error.message}` }], isError: true };
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
