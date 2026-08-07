/**
 * Products Resource
 */

import { TCGplayerError, ValidationError } from '../errors.js';
import {
  ProductDetails,
  LatestSalesOptions,
  LatestSalesResponse,
  PriceHistoryOptions,
  PriceHistoryResponse,
  VolatilityResponse,
  BuylistPriceRecord,
  ProductListingsOptions,
  ProductListingsResponse,
  InfiniteProduct,
} from '../types.js';
import { BASE_URLS, DEFAULT_HEADERS, POST_HEADERS, DEFAULT_MPFEV } from '../constants.js';

function assertPositiveNumber(value: unknown, name: string): void {
  if (typeof value !== 'number' || value <= 0) {
    throw new ValidationError(name, 'must be a positive number');
  }
}

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

export class ProductsResource {
  async details(productId: number | string): Promise<ProductDetails> {
    assertPositiveNumber(Number(productId), 'productId');
    const mpfev = DEFAULT_MPFEV;
    const url = `${BASE_URLS['mp-search-api']}/v2/product/${productId}/details?mpfev=${mpfev}`;
    return request<ProductDetails>(url);
  }

  async listings(productId: number | string, options: ProductListingsOptions = {}): Promise<ProductListingsResponse> {
    assertPositiveNumber(Number(productId), 'productId');
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

    const url = `${BASE_URLS['mp-search-api']}/v1/product/${productId}/listings`;
    return postRequest<ProductListingsResponse>(url, body);
  }

  async sales(productId: number | string, options: LatestSalesOptions = {}): Promise<LatestSalesResponse> {
    assertPositiveNumber(Number(productId), 'productId');
    const {
      mpfev = DEFAULT_MPFEV,
      conditions = [],
      languages = [1],
      variants = [],
      listingType = 'All',
      limit = 25,
    } = options;

    const url = `${BASE_URLS.mpapi}/v2/product/${productId}/latestsales?mpfev=${mpfev}`;
    return postRequest<LatestSalesResponse>(url, { conditions, languages, variants, listingType, limit });
  }

  async priceHistory(productId: number | string, options: PriceHistoryOptions = {}): Promise<PriceHistoryResponse> {
    assertPositiveNumber(Number(productId), 'productId');
    const { range = 'quarter' } = options;
    const pageRequestId = `${Date.now()}:www.tcgplayer.com/product/${productId}`;

    const url = `${BASE_URLS['infinite-api']}/price/history/${productId}/detailed?range=${range}`;
    return request<PriceHistoryResponse>(url, {
      headers: {
        ...DEFAULT_HEADERS,
        'Accept': '*/*',
        'X-PageRequest-ID': pageRequestId,
      },
    });
  }

  async volatility(skuId: number | string, mpfev = DEFAULT_MPFEV): Promise<VolatilityResponse> {
    assertPositiveNumber(Number(skuId), 'skuId');
    const url = `${BASE_URLS.mpgateway}/v1/pricepoints/marketprice/skus/${skuId}/volatility?mpfev=${mpfev}`;
    return request<VolatilityResponse>(url);
  }

  async buylistPrice(productId: number | string, mpfev = DEFAULT_MPFEV): Promise<BuylistPriceRecord[]> {
    assertPositiveNumber(Number(productId), 'productId');
    const url = `${BASE_URLS.mpgateway}/v1/pricepoints/buylist/marketprice/products/${productId}?mpfev=${mpfev}`;
    return request<BuylistPriceRecord[]>(url);
  }

  async infinite(productId: number | string): Promise<InfiniteProduct> {
    assertPositiveNumber(Number(productId), 'productId');
    const url = `${BASE_URLS['infinite-api']}/product/${productId}`;
    return request<InfiniteProduct>(url);
  }
}
