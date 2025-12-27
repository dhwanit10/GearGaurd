const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || '';

function joinUrl(path: string) {
  const base = API_BASE.replace(/\/+$|^\s+|\s+$/g, '');
  const p = path.replace(/^\/+/, '');
  return `${base}/${p}`;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = joinUrl(path);
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    let body: any = text;
    try { body = JSON.parse(text); } catch {}
    const err: any = new Error(res.statusText || 'Request failed');
    err.status = res.status;
    err.body = body;
    throw err;
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

export const get = (path: string, init: RequestInit = {}) =>
  apiFetch(path, { method: 'GET', ...init });

export const post = (path: string, body: any, init: RequestInit = {}) =>
  apiFetch(path, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json', ...(init.headers as any) }, ...init });

export const put = (path: string, body: any, init: RequestInit = {}) =>
  apiFetch(path, { method: 'PUT', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json', ...(init.headers as any) }, ...init });

export const del = (path: string, init: RequestInit = {}) =>
  apiFetch(path, { method: 'DELETE', ...init });
