import { ORDER_API_URL } from '../config/site.js';

/**
 * Sends orders to the endpoint from VITE_ORDER_API_URL.
 *
 * The frontend never talks to Telegram or a database directly: bot tokens
 * and credentials must live on a server. The server is also the only place
 * that can be trusted to recalculate prices, so `clientTotals` is sent for
 * reference only.
 */

export class OrderSubmitError extends Error {
  /** @param {'not_configured' | 'network' | 'timeout' | 'rejected' | 'server'} kind */
  constructor(kind, message = '') {
    super(message || kind);
    this.name = 'OrderSubmitError';
    this.kind = kind;
  }
}

export function isOrderApiConfigured(url = ORDER_API_URL) {
  return Boolean(url);
}

export function buildOrderPayload({ lines, form, totals, phone, lang }) {
  return {
    items: lines.map(({ dish, qty }) => ({ id: dish.id, quantity: qty })),
    customer: { name: form.name.trim(), phone },
    fulfillment: form.fulfillment,
    address: form.fulfillment === 'delivery' ? form.address.trim() : '',
    comment: form.comment.trim(),
    language: lang,
    clientTotals: {
      subtotal: totals.subtotal,
      deliveryFee: totals.deliveryFee,
      total: totals.total,
    },
  };
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function pickMessage(body) {
  if (!body || typeof body !== 'object') return '';
  const message = body.message ?? body.detail ?? body.error;
  return typeof message === 'string' ? message : '';
}

/**
 * @returns {Promise<{ number: string | null }>}
 * @throws {OrderSubmitError}
 */
export async function submitOrder(payload, { url = ORDER_API_URL, timeoutMs = 15_000, fetchImpl = fetch } = {}) {
  if (!isOrderApiConfigured(url)) throw new OrderSubmitError('not_configured');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (error) {
    throw new OrderSubmitError(error?.name === 'AbortError' ? 'timeout' : 'network');
  } finally {
    clearTimeout(timer);
  }

  const body = await readJson(response);
  if (response.ok) {
    const number = body?.number ?? body?.orderNumber ?? body?.id ?? null;
    return { number: number == null ? null : String(number) };
  }
  // 4xx: the server refused the order (validation, unavailable dish, etc.)
  if (response.status >= 400 && response.status < 500) {
    throw new OrderSubmitError('rejected', pickMessage(body));
  }
  throw new OrderSubmitError('server', pickMessage(body));
}
