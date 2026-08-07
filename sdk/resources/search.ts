/**
 * Search Resource
 */

import { TCGplayerError, ValidationError } from '../errors.js';
import {
  SearchOptions,
  AutocompleteProduct,
  TrendingSuggestion,
  BestsellerProduct,
} from '../types.js';
import { BASE_URLS, DEFAULT_HEADERS, POST_HEADERS } from '../constants.js';

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
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

export class SearchResource {
  async autocomplete(query: string, options: { productLine?: string; sessionId?: string } = {}): Promise<AutocompleteProduct[]> {
    if (typeof query !== 'string' || query.trim() === '') {
      throw new ValidationError('query', 'must be a non-empty string');
    }

    const { productLine = 'Pokemon', sessionId = generateSessionId() } = options;
    const params = new URLSearchParams({
      q: query,
      'session-id': sessionId,
      'product-line-affinity': productLine,
      algorithm: 'product_line_affinity',
    });

    const url = `${BASE_URLS.data}/autocomplete?${params}`;
    const data = await request<{ products?: AutocompleteProduct[] }>(url);
    return data.products || [];
  }

  async fullSearch(options: SearchOptions = {}): Promise<unknown> {
    const {
      q = '',
      productLine = 'Pokemon',
      from = 0,
      size = 24,
      algorithm = 'sales_dismax',
      filters = {},
      sort = {},
      shippingCountry = 'US',
    } = options;

    const body = {
      algorithm,
      from,
      size,
      filters: {
        term: {
          productLineName: [productLine],
          ...filters.term,
        },
        range: filters.range || {},
        match: filters.match || {},
      },
      listingSearch: {
        context: { cart: { packages: {} } },
        filters: {
          term: { sellerStatus: 'Live', channelId: 0 },
          range: { quantity: { gte: 1 } },
          exclude: { channelExclusion: 0 },
        },
      },
      context: {
        cart: { packages: {} },
        shippingCountry,
        userProfile: {},
      },
      settings: {
        useFuzzySearch: true,
        didYouMean: {},
      },
      sort,
    };

    const url = `${BASE_URLS['mp-search-api']}/v1/search/request?q=${encodeURIComponent(q)}&isList=false&mpfev=5429`;
    return postRequest(url, body);
  }

  async bestsellers(options: { categoryId?: string; limit?: number } = {}): Promise<unknown> {
    const { categoryId = '3', limit = 20 } = options;
    const params = new URLSearchParams({ categoryId, limit: String(limit) });
    const url = `${BASE_URLS['mp-search-api']}/v1/search/bestsellers?${params}`;
    return request(url);
  }

  async trending(options: { productLine?: string; limit?: number } = {}): Promise<{ products?: TrendingSuggestion[] }> {
    const { productLine = 'Pokemon', limit = 10 } = options;
    const url = `${BASE_URLS.data}/suggestions/trending`;
    const body = { productLine, limit: Number(limit) };
    const data = await postRequest<{ products?: TrendingSuggestion[] }>(url, body);
    return data;
  }
}
