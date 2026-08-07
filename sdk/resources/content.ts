/**
 * Content Resource
 */

import { TCGplayerError, ValidationError } from '../errors.js';
import {
  Tag,
  KickbackPromotion,
  Article,
  NormalizedCardName,
} from '../types.js';
import { BASE_URLS, DEFAULT_HEADERS } from '../constants.js';

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

export class ContentResource {
  async articles(options: { vertical?: string; limit?: number } = {}): Promise<Article[]> {
    const { vertical = 'pokemon', limit = 10 } = options;
    const params = new URLSearchParams({ vertical, limit: String(limit) });
    const url = `${BASE_URLS['infinite-api']}/c/articles/?${params}`;
    const data = await request<{ result: Article[] }>(url);
    return data.result || [];
  }

  async trendingArticles(options: { limit?: number } = {}): Promise<Article[]> {
    const { limit = 10 } = options;
    const params = new URLSearchParams({ limit: String(limit) });
    const url = `${BASE_URLS['infinite-api']}/content/articles/trending/?${params}`;
    const data = await request<{ result: Article[] }>(url);
    return data.result || [];
  }

  async tags(options: { domains?: string; classifications?: string } = {}): Promise<Tag[]> {
    const { domains = 'marketplace', classifications = 'product line affinity' } = options;
    const params = new URLSearchParams({ domains, classifications });
    const url = `${BASE_URLS['infinite-api']}/c/tags?${params}`;
    const data = await request<{ result: Tag[] }>(url);
    return data.result || [];
  }

  async kickbacks(options: { active?: boolean } = {}): Promise<KickbackPromotion[]> {
    const { active = true } = options;
    const params = new URLSearchParams({ active: String(active) });
    const url = `${BASE_URLS.mpapi}/v2/kickbacks?${params}`;
    const data = await request<{ results?: KickbackPromotion[] }>(url);
    return data.results || [];
  }

  async normalizeCardName(name: string): Promise<NormalizedCardName> {
    if (typeof name !== 'string' || name.trim() === '') {
      throw new ValidationError('name', 'must be a non-empty string');
    }
    const url = `${BASE_URLS['infinite-api']}/card/normalize/${encodeURIComponent(name)}`;
    return request<NormalizedCardName>(url);
  }
}