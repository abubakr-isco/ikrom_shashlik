/**
 * Web Storage access that never throws: private mode, disabled storage or
 * quota errors just mean nothing is persisted.
 */
function store(kind) {
  return kind === 'session' ? window.sessionStorage : window.localStorage;
}

export function readJson(key, fallback = null, kind = 'local') {
  try {
    const raw = store(kind).getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJson(key, value, kind = 'local') {
  try {
    store(kind).setItem(key, JSON.stringify(value));
  } catch {
    // Persistence is a convenience; ignore failures.
  }
}

export function removeItem(key, kind = 'local') {
  try {
    store(kind).removeItem(key);
  } catch {
    // ignore
  }
}
