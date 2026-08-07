/**
 * TCGplayer API Examples
 *
 * Run with: node example.js
 */

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
  getProduct
} from './server.js';

async function main() {
  console.log('=== TCGplayer API Examples ===\n');

  // 1. Quick search with autocomplete
  console.log('1. Autocomplete search for "pikachu":');
  const acResults = await autocomplete('pikachu', { productLine: 'Pokemon' });
  console.log(`   Found ${acResults.length} suggestions`);
  if (acResults[0]) {
    console.log(`   Top result: ${acResults[0]['product-name']} (ID: ${acResults[0]['product-id']})`);
  }

  // 2. Full search with filters
  console.log('\n2. Search for "charizard" with filters:');
  const searchResults = await search({ q: 'charizard', size: 5 });
  const total = searchResults.results[0]?.totalResults;
  console.log(`   Total results: ${total}`);
  const aggs = searchResults.results[0]?.aggregations;
  if (aggs) {
    console.log(`   Filter options: ${Object.keys(aggs).join(', ')}`);
  }

  // 3. Get product with all data
  console.log('\n3. Full product data for ID 502558:');
  const product = await getProduct(502558);
  console.log(`   Product: ${product.details.productName}`);
  console.log(`   Set: ${product.details.setName}`);
  console.log(`   Market Price: $${product.details.marketPrice}`);
  console.log(`   Recent sales: ${product.sales.totalResults}`);
  console.log(`   Price history buckets: ${product.priceHistory.result[0]?.buckets.length || 0}`);

  // 4. Get latest sales with filters
  console.log('\n4. Latest sales for 502558 (Near Mint Holofoil):');
  const sales = await getLatestSales(502558, {
    conditions: [6], // Near Mint
    limit: 5
  });
  console.log(`   Found ${sales.totalResults} sales`);
  sales.data.slice(0, 3).forEach(s => {
    console.log(`   - $${s.purchasePrice} + $${s.shippingPrice} ship (${s.condition})`);
  });

  // 5. Get price history
  console.log('\n5. Price history (quarter) for 502558:');
  const history = await getPriceHistory(502558, { range: 'quarter' });
  const buckets = history.result[0]?.buckets.slice(0, 4) || [];
  buckets.forEach(b => {
    console.log(`   ${b.bucketStartDate}: $${b.marketPrice} (${b.quantitySold} sold)`);
  });

  // 6. Get volatility for a SKU
  console.log('\n6. Market volatility:');
  if (product.details.skus[0]) {
    const sku = product.details.skus[0].sku;
    const vol = await getVolatility(sku);
    console.log(`   SKU ${sku}: ${vol.volatility} (z-score: ${vol.zScore})`);
  }

  // 7. Get product lines
  console.log('\n7. Product lines:');
  const lines = await getProductLines();
  console.log(`   Total: ${lines.length}`);
  const pokemon = lines.find(l => l.productLineName === 'Pokemon');
  if (pokemon) {
    console.log(`   Pokemon ID: ${pokemon.productLineId}`);
  }

  // 8. Get filter mappings
  console.log('\n8. Search filter fields for Pokemon:');
  const mappings = await getProductLineMappings('Pokemon');
  console.log(`   Available filters: ${mappings.map(m => m.name).join(', ')}`);

  // 9. Get category filters
  console.log('\n9. Category filters for Pokemon (categoryId 3):');
  const filters = await getCategoryFilters('3');
  console.log(`   Conditions: ${filters.conditions.map(c => c.value).join(', ')}`);
  console.log(`   Languages: ${filters.languages.map(l => l.value).join(', ')}`);

  // 10. Get latest sets
  console.log('\n10. Latest sets:');
  const sets = await getLatestSets();
  // Response is array of {categoryId, latestSets[]}
  const pokemonCategory = sets.find(c => c.categoryId === 3);
  const pokemonSets = pokemonCategory?.latestSets || [];
  console.log(`   Pokemon sets found: ${pokemonSets.length}`);
  if (pokemonSets[0]) {
    console.log(`   Most recent: ${pokemonSets[0].setName}`);
  }

  console.log('\n=== All examples completed ===');
}

main().catch(console.error);
