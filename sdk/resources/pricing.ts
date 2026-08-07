/**
 * Pricing Resource
 *
 * Handles market price data, SKU pricing, and volatility metrics.
 */

import { TCGplayerError, ValidationError } from '../errors.js';
import { SkuMarketPriceRecord } from '../types.js';
import { BASE_URLS, POST_HEADERS, DEFAULT_HEADERS, DEFAULT_MPFEV } from '../constants.js';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...DEFAULT_HEADERS,
      ...(options?.headers as Record<string, string>),
    },
  });

  if (!response.ok) {
    throw new TCGplayerError(response.status, url, `${options?.method || 'GET'} ${url} failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

async function postRequest<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: POST_HEADERS,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new TCGplayerError(response.status, url, `POST ${url} failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Get market prices for multiple SKUs at once.
 *
 * @param skuIds - Array of TCGplayer SKU IDs (max batch size varies)
 * @param mpfev - Protocol version (default: 5429)
 * @returns Array of market price records for each SKU
 *
 * @example
 * const prices = await client.pricing.skuMarketPrices([12345, 67890]);
 */
export class PricingResource {
  async skuMarketPrices(skuIds: number[], mpfev = DEFAULT_MPFEV): Promise<SkuMarketPriceRecord[]> {
    if (!Array.isArray(skuIds) || skuIds.length === 0) {
      throw new ValidationError('skuIds', 'must be a non-empty array');
    }

    for (const id of skuIds) {
      if (typeof id !== 'number' || id <= 0) {
        throw new ValidationError('skuIds', 'must contain only positive numbers');
      }
    }

    const url = `${BASE_URLS.mpgateway}/v1/pricepoints/marketprice/skus/search?mpfev=${mpfev}`;
    return postRequest<SkuMarketPriceRecord[]>(url, { skuIds });
  }
}
