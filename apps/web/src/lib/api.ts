'use client';

const DEV_API_BASE_URL_FALLBACK = 'http://localhost:8787';

export function normalizeApiBaseUrl(rawValue: string) {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return '';
  }

  try {
    const url = new URL(trimmed);
    if (url.hostname === '127.0.0.1') {
      url.hostname = 'localhost';
    }
    return url.toString().replace(/\/+$/, '');
  } catch {
    return trimmed
      .replace(/^http:\/\/127\.0\.0\.1(?=[:/]|$)/, 'http://localhost')
      .replace(/^https:\/\/127\.0\.0\.1(?=[:/]|$)/, 'https://localhost')
      .replace(/\/+$/, '');
  }
}

export const API_BASE_URL = normalizeApiBaseUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL
    ?? (process.env.NODE_ENV === 'development' ? DEV_API_BASE_URL_FALLBACK : ''),
);

export const REQUEST_TIMEOUT_MS = 30_000;

export function apiUrl(path: string) {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}
