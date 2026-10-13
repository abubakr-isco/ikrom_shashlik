import { describe, expect, it } from 'vitest';
import { dishesById } from '../data/menu.js';
import { buildLines, calcTotals } from '../lib/cart.js';
import { buildOrderPayload, OrderSubmitError, submitOrder } from './orderService.js';

const URL = 'https://api.example.test/orders';
const json = (status, body) => async () => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

async function failure(promise) {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error('expected the promise to reject');
}

describe('buildOrderPayload', () => {
  it('sends dish ids and quantities, not prices, plus contact details', () => {
    const lines = buildLines([{ id: 'plov', qty: 2 }], dishesById);
    const totals = calcTotals(lines, 'pickup', { fee: 15_000, freeFrom: 0, minOrder: 0 });
    const payload = buildOrderPayload({
      lines,
      form: { name: ' Азиз ', address: 'ignored for pickup', comment: ' без лука ', fulfillment: 'pickup' },
      totals,
      phone: '+998901234567',
      lang: 'ru',
    });
    expect(payload).toEqual({
      items: [{ id: 'plov', quantity: 2 }],
      customer: { name: 'Азиз', phone: '+998901234567' },
      fulfillment: 'pickup',
      address: '',
      comment: 'без лука',
      language: 'ru',
      clientTotals: { subtotal: totals.subtotal, deliveryFee: 0, total: totals.subtotal },
    });
  });
});

describe('submitOrder', () => {
  it('refuses to pretend success when no endpoint is configured', async () => {
    const error = await failure(submitOrder({}, { url: '' }));
    expect(error).toBeInstanceOf(OrderSubmitError);
    expect(error.kind).toBe('not_configured');
  });

  it('returns the order number from the server', async () => {
    const result = await submitOrder({}, { url: URL, fetchImpl: json(201, { number: 'IK-1042' }) });
    expect(result).toEqual({ number: 'IK-1042' });
  });

  it('accepts a successful response without a body', async () => {
    const result = await submitOrder({}, { url: URL, fetchImpl: async () => new Response(null, { status: 204 }) });
    expect(result).toEqual({ number: null });
  });

  it('passes on the server reason when an order is rejected', async () => {
    const error = await failure(submitOrder({}, { url: URL, fetchImpl: json(400, { detail: 'Блюдо закончилось' }) }));
    expect(error.kind).toBe('rejected');
    expect(error.message).toBe('Блюдо закончилось');
  });

  it('separates server errors, network failures and timeouts', async () => {
    expect((await failure(submitOrder({}, { url: URL, fetchImpl: json(502, {}) }))).kind).toBe('server');
    const offline = async () => {
      throw new TypeError('Failed to fetch');
    };
    expect((await failure(submitOrder({}, { url: URL, fetchImpl: offline }))).kind).toBe('network');
    const hang = (_, { signal }) =>
      new Promise((_, reject) => signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError'))));
    expect((await failure(submitOrder({}, { url: URL, fetchImpl: hang, timeoutMs: 20 }))).kind).toBe('timeout');
  });
});
