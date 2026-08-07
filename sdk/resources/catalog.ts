/**
 * Catalog Resource
 */

import { TCGplayerError, ValidationError } from '../errors.js';
import {
  ProductLine,
  ProductLineMapping,
  CategoryFilter,
  SetNameResult,
  CatalogGroup,
  Vertical,
} from '../types.js';
import { BASE_URLS, DEFAULT_HEADERS, DEFAULT_MPFEV } from '../constants.js';

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

export class CatalogResource {
  async productLines(): Promise<ProductLine[]> {
    const url = `${BASE_URLS['mp-search-api']}/v1/search/productLines`;
    return request<ProductLine[]>(url);
  }

  async productLineMappings(productLine = 'Pokemon', mpfev = DEFAULT_MPFEV): Promise<ProductLineMapping[]> {
    const url = `${BASE_URLS['mp-search-api']}/v1/search/productLineMappings?productLine=${encodeURIComponent(productLine)}&mpfev=${mpfev}`;
    return request<ProductLineMapping[]>(url);
  }

  async categoryFilters(categoryId = '3', mpfev = DEFAULT_MPFEV): Promise<CategoryFilter[]> {
    const url = `${BASE_URLS['mp-search-api']}/v1/product/categoryfilters?categoryId=${categoryId}&mpfev=${mpfev}`;
    return request<CategoryFilter[]>(url);
  }

  async latestSets(productLineIds = '1,2,3,71,68,63,79,62,85'): Promise<unknown> {
    const url = `${BASE_URLS['mp-search-api']}/v1/product/latestsets/${productLineIds}`;
    return request(url);
  }

  async setName(setId: number | string): Promise<SetNameResult> {
    assertPositiveNumber(Number(setId), 'setId');
    const url = `${BASE_URLS.mpapi}/v2/Catalog/SetName/${setId}`;
    return request<SetNameResult>(url);
  }

  async catalogGroups(): Promise<CatalogGroup[]> {
    const url = `${BASE_URLS.mpapi}/v2/Catalog/CatalogGroups`;
    return request<CatalogGroup[]>(url);
  }

  async verticals(): Promise<Vertical[]> {
    const url = `${BASE_URLS['infinite-api']}/c/verticals/`;
    return request<Vertical[]>(url);
  }
}
