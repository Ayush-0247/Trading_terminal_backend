const store = new Map();

export const getCached = (key) => {
  const item = store.get(key);

  if (!item) {
    return null;
  }

  if (item.expiresAt <= Date.now()) {
    store.delete(key);
    return null;
  }

  return item.value;
};

export const setCached = (key, value, ttlMs) => {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlMs
  });

  return value;
};

export const getOrSetCached = async (key, ttlMs, fetcher) => {
  const cached = getCached(key);

  if (cached) {
    return cached;
  }

  const value = await fetcher();
  return setCached(key, value, ttlMs);
};

export const clearCache = () => {
  store.clear();
};
