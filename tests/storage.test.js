import { beforeEach, describe, expect, it } from 'vitest';
import { clearAllData, exportData, getFolders, getSettings, getVehicles, upsertVehicle } from '../src/utils/storage.js';

const store = {};

beforeEach(() => {
  Object.keys(store).forEach((key) => delete store[key]);
  globalThis.chrome = {
    storage: {
      local: {
        get: async (key) => ({ [key]: store[key] }),
        set: async (patch) => Object.assign(store, patch),
      },
    },
  };
});

describe('storage utilities', () => {
  it('normalizes large vehicle payloads before storing', async () => {
    const priceHistory = Array.from({ length: 130 }, (_, index) => ({ price: index, ts: index }));

    await upsertVehicle({
      id: 'car_1',
      title: 'Test car',
      images: new Array(20).fill('https://example.test/car.jpg'),
      description: 'x'.repeat(4000),
      priceHistory,
    });

    const [saved] = await getVehicles();
    expect(saved.images).toHaveLength(12);
    expect(saved.description).toHaveLength(3000);
    expect(saved.priceHistory).toHaveLength(100);
    expect(saved.priceHistory[0].price).toBe(30);
  });

  it('exports and clears local data', async () => {
    await upsertVehicle({ id: 'car_1', title: 'Test car' });
    const exported = await exportData();

    expect(exported.vehicles).toHaveLength(1);
    expect(exported.version).toBe(1);

    await clearAllData();

    expect(await getVehicles()).toEqual([]);
    expect(await getFolders()).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'all', locked: true }),
    ]));
    expect(await getSettings()).toMatchObject({ checkIntervalMinutes: 60, notificationsEnabled: true });
  });
});
