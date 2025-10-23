export async function safeJson<T = any>(url: string): Promise<T> {
    const r = await fetch(url, { cache: 'no-store' });
    const text = await r.text();
  
    if (!r.ok) {
      throw new Error(`HTTP ${r.status} from ${url}: ${text || '(no body)'}`);
    }
    if (!text) {
      // Treat empty body as empty list/object to avoid JSON parse errors
      return ([] as unknown) as T;
    }
    try {
      return JSON.parse(text) as T;
    } catch (e) {
      throw new Error(`Invalid JSON from ${url}: ${text.slice(0, 200)}`);
    }
  }
  