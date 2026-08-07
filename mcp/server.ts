import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { TCGplayerClient } from '../sdk/client.js';

/**
 * TCGplayer MCP Server
 *
 * Provides Claude Code tools for searching TCGplayer products, fetching prices,
 * sales data, and rendering card images as ASCII art.
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

/** SDK client shared across all tool calls */
const client = new TCGplayerClient();
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
      {
        name: 'tcgplayer_render_card',
        description: 'Render a TCGplayer card as ASCII art',
        inputSchema: {
          type: 'object',
          properties: {
            productId: { type: 'number', description: 'TCGplayer product ID' },
            width: { type: 'number', description: 'ASCII output width in characters (default: 64)' },
          },
          required: ['productId'],
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
        const results = await client.search.autocomplete(args.query as string, {
          productLine: (args.productLine as string) || 'Pokemon',
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_search': {
        const results = await client.search.fullSearch({
          q: (args.q as string) || '',
          productLine: (args.productLine as string) || 'Pokemon',
          from: (args.from as number) || 0,
          size: (args.size as number) || 24,
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_product': {
        const [details, sales, priceHistory] = await Promise.all([
          client.products.details(args.productId as number),
          client.products.sales(args.productId as number),
          client.products.priceHistory(args.productId as number),
        ]);
        return { content: [{ type: 'text', text: JSON.stringify({ details, sales, priceHistory }, null, 2) }] };
      }

      case 'tcgplayer_product_details': {
        const results = await client.products.details(args.productId as number);
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_latest_sales': {
        const results = await client.products.sales(args.productId as number, {
          conditions: (args.conditions as (number | string)[]) || [],
          languages: (args.languages as (number | string)[]) || [1],
          limit: (args.limit as number) || 25,
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_price_history': {
        const results = await client.products.priceHistory(args.productId as number, {
          range: (args.range as 'week' | 'month' | 'quarter' | 'year') || 'quarter',
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_volatility': {
        const results = await client.products.volatility(args.skuId as number);
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_buylist_price': {
        const results = await client.products.buylistPrice(args.productId as number);
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_sku_market_prices': {
        const results = await client.pricing.skuMarketPrices(args.skuIds as number[]);
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_category_filters': {
        const results = await client.catalog.categoryFilters((args.categoryId as string) || '3');
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_product_lines': {
        const results = await client.catalog.productLines();
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_product_line_mappings': {
        const results = await client.catalog.productLineMappings((args.productLine as string) || 'Pokemon');
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_latest_sets': {
        const results = await client.catalog.latestSets((args.productLineIds as string) || '1,2,3');
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_product_listings': {
        const results = await client.products.listings(args.productId as number, {
          sellerStatus: (args.sellerStatus as string) || 'Live',
          languages: (args.languages as string[]) || ['English'],
          conditions: (args.conditions as string[]) || [],
          quantityGte: (args.quantityGte as number) || 1,
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_set_name': {
        const results = await client.catalog.setName(args.setId as number);
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_recommendations': {
        const results = await client.products.recommendations(args.productIds as number[], {
          limit: (args.limit as number) || 10,
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_kickbacks': {
        const results = await client.content.kickbacks();
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_tags': {
        const results = await client.content.tags({
          domains: (args.domains as string) || 'marketplace',
          classifications: (args.classifications as string) || 'product line affinity',
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_verticals': {
        const results = await client.catalog.verticals();
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_bestsellers': {
        const results = await client.search.bestsellers({
          categoryId: (args.categoryId as string) || '3',
          limit: (args.limit as number) || 20,
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_trending': {
        const results = await client.search.trending({
          productLine: (args.productLine as string) || 'Pokemon',
          limit: (args.limit as number) || 10,
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_catalog_groups': {
        const results = await client.catalog.catalogGroups();
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_country_codes': {
        const results = await client.catalog.countryCodes();
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_articles': {
        const results = await client.content.articles({
          vertical: (args.vertical as string) || 'pokemon',
          limit: (args.limit as number) || 10,
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_trending_articles': {
        const results = await client.content.trendingArticles({
          limit: (args.limit as number) || 10,
        });
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_infinite_product': {
        const results = await client.products.infinite(args.productId as number);
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_normalize_card_name': {
        const results = await client.content.normalizeCardName(args.name as string);
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'tcgplayer_render_card': {
        try {
          const width = (args.width as number) || 64;
          const response = await client.products.infinite(args.productId as number);
          const product = (response as any).result || response;

          const { Jimp } = await import('jimp');
          const imageUrl = product.tcgImageURL;
          if (!imageUrl) {
            return { content: [{ type: 'text', text: `No image for ${args.productId}` }], isError: true };
          }

          const imageBuffer = await fetch(imageUrl).then(r => r.arrayBuffer());
          const image = await Jimp.read(Buffer.from(imageBuffer));

          const aspectRatio = image.height / image.width;
          const scaledHeight = Math.round(width * aspectRatio * 0.5);
          const sampleX = image.width / width;
          const sampleY = image.height / scaledHeight;

          const chars = ' ░▒▓█';
          let ascii = '';

          for (let y = 0; y < scaledHeight; y++) {
            for (let x = 0; x < width; x++) {
              const px = Math.min(Math.floor(x * sampleX), image.width - 1);
              const py = Math.min(Math.floor(y * sampleY), image.height - 1);
              const idx = (py * image.width + px) * 4;
              const r = image.bitmap.data[idx];
              const g = image.bitmap.data[idx + 1];
              const b = image.bitmap.data[idx + 2];
              const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              const charIndex = Math.min(Math.floor(brightness * chars.length), chars.length - 1);
              ascii += chars[charIndex];
            }
            ascii += '\n';
          }

          const cardName = product.name || `Product ${args.productId}`;
          const header = `\n${cardName}\n${'═'.repeat(width)}\n`;
          return { content: [{ type: 'text', text: header + ascii }] };
        } catch (err) {
          return { content: [{ type: 'text', text: `Error: ${(err as Error).message}` }], isError: true };
        }
      }

      case 'tcgplayer_free_shipping_threshold': {
        // Not in SDK yet - fall back to server.ts
        const { getFreeShippingThreshold } = await import('../server.js');
        const results = await getFreeShippingThreshold();
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
