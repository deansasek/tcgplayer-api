/**
 * Catalog Resource
 *
 * Handles product lines, categories, sets, filters, and country data.
 */

import { TCGplayerError, ValidationError } from '../errors.js';
import {
  ProductLine,
  ProductLineMapping,
  CategoryFilter,
  SetNameResult,
  CatalogGroup,
  Vertical,
  CountryCode,
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

/**
 * Get all available product lines (e.g., Pokemon, Magic: The Gathering, Yu-Gi-Oh!).
 *
 * @example
 * const lines = await client.catalog.productLines();
 */
export class CatalogResource {
  /**
   * Get all available product lines.
   */
  async productLines(): Promise<ProductLine[]> {
    const url = `${BASE_URLS['mp-search-api']}/v1/search/productLines`;
    return request<ProductLine[]>(url);
  }

  /**
   * Get filter field mappings for a specific product line.
   *
   * @param productLine - Product line name (default: "Pokemon")
   * @param mpfev - Protocol version (default: 5429)
   */
  async productLineMappings(productLine = 'Pokemon', mpfev = DEFAULT_MPFEV): Promise<ProductLineMapping[]> {
    const url = `${BASE_URLS['mp-search-api']}/v1/search/productLineMappings?productLine=${encodeURIComponent(productLine)}&mpfev=${mpfev}`;
    return request<ProductLineMapping[]>(url);
  }

  /**
   * Get available filter options for a category (conditions, languages, variants).
   *
   * @param categoryId - Category ID (default: "3" for Pokemon)
   * @param mpfev - Protocol version (default: 5429)
   */
  async categoryFilters(categoryId = '3', mpfev = DEFAULT_MPFEV): Promise<CategoryFilter[]> {
    const url = `${BASE_URLS['mp-search-api']}/v1/product/categoryfilters?categoryId=${categoryId}&mpfev=${mpfev}`;
    return request<CategoryFilter[]>(url);
  }

  /**
   * Get the latest sets for specified product lines.
   *
   * @param productLineIds - Comma-separated product line IDs (default: "1,2,3,71,68,63,79,62,85")
   */
  async latestSets(productLineIds = '1,2,3,71,68,63,79,62,85'): Promise<unknown> {
    const url = `${BASE_URLS['mp-search-api']}/v1/product/latestsets/${productLineIds}`;
    return request(url);
  }

  /**
   * Get set information by set ID.
   *
   * @param setId - TCGplayer set ID
   */
  async setName(setId: number | string): Promise<SetNameResult> {
    assertPositiveNumber(Number(setId), 'setId');
    const url = `${BASE_URLS.mpapi}/v2/Catalog/SetName/${setId}`;
    return request<SetNameResult>(url);
  }

  /**
   * Get catalog groups (TCG vs Tabletop categories).
   */
  async catalogGroups(): Promise<CatalogGroup[]> {
    const url = `${BASE_URLS.mpapi}/v2/Catalog/CatalogGroups`;
    return request<CatalogGroup[]>(url);
  }

  /**
   * Get available game verticals.
   */
  async verticals(): Promise<Vertical[]> {
    const url = `${BASE_URLS['infinite-api']}/c/verticals/`;
    return request<Vertical[]>(url);
  }

  /**
   * Get available country codes for shipping.
   */
  async countryCodes(): Promise<CountryCode[]> {
    const url = `${BASE_URLS.mpapi}/v2/address/countryCodes`;
    return request<CountryCode[]>(url);
  }
}
