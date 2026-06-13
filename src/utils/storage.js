const KEYS = {
  VEHICLES: 'ag_vehicles',
  FOLDERS: 'ag_folders',
  SETTINGS: 'ag_settings',
  NOTIFICATIONS: 'ag_notifications',
};

const DEFAULT_FOLDERS = [
  { id: 'all', name: 'Vsa vozila', color: '#f47920', locked: true },
  { id: 'favourites', name: 'Priljubljeni', color: '#f59e0b', locked: false },
];

const DEFAULT_SETTINGS = {
  checkIntervalMinutes: 60,
  notificationsEnabled: true,
  lastChecked: null,
};

const MAX_PRICE_HISTORY = 100;

// ─── Write-queue mutex (Bug 8) ────────────────────────────────────────────────
// All vehicle writes are serialized through this chain so that concurrent
// read-modify-write operations (e.g. a manual save racing with the monitoring
// cycle) never clobber each other.

let _writeChain = Promise.resolve();

function serialized(fn) {
  const next = _writeChain.then(fn, fn); // run fn even if previous step threw
  _writeChain = next.catch(() => {});    // keep chain alive on error
  return next;
}

// ─── Vehicles ────────────────────────────────────────────────────────────────

export async function getVehicles() {
  const r = await chrome.storage.local.get(KEYS.VEHICLES);
  return r[KEYS.VEHICLES] ?? [];
}

export async function getVehicleById(id) {
  const vehicles = await getVehicles();
  return vehicles.find((v) => v.id === id) ?? null;
}

export function upsertVehicle(vehicle) {
  return serialized(async () => {
    const vehicles = await getVehicles();
    const idx = vehicles.findIndex((v) => v.id === vehicle.id);
    const normalizedVehicle = normalizeVehicle(vehicle);
    if (idx >= 0) {
      vehicles[idx] = normalizeVehicle({ ...vehicles[idx], ...normalizedVehicle });
    } else {
      vehicles.push(normalizedVehicle);
    }
    await chrome.storage.local.set({ [KEYS.VEHICLES]: vehicles });
    return vehicles;
  });
}

export function removeVehicle(id) {
  return serialized(async () => {
    const vehicles = await getVehicles();
    const filtered = vehicles.filter((v) => v.id !== id);
    await chrome.storage.local.set({ [KEYS.VEHICLES]: filtered });
    return filtered;
  });
}

export function moveVehicleToFolder(vehicleId, folderId) {
  return serialized(async () => {
    const vehicles = await getVehicles();
    const updated = vehicles.map((v) =>
      v.id === vehicleId ? { ...v, folderId } : v
    );
    await chrome.storage.local.set({ [KEYS.VEHICLES]: updated });
    return updated;
  });
}

export function updateVehicleStatus(id, patch) {
  return serialized(async () => {
    const vehicles = await getVehicles();
    const updated = vehicles.map((v) => (v.id === id ? normalizeVehicle({ ...v, ...patch }) : v));
    await chrome.storage.local.set({ [KEYS.VEHICLES]: updated });
    return updated;
  });
}

// ─── Folders ─────────────────────────────────────────────────────────────────

export async function getFolders() {
  const r = await chrome.storage.local.get(KEYS.FOLDERS);
  return r[KEYS.FOLDERS] ?? DEFAULT_FOLDERS;
}

export async function upsertFolder(folder) {
  const folders = await getFolders();
  const idx = folders.findIndex((f) => f.id === folder.id);
  if (idx >= 0) {
    folders[idx] = { ...folders[idx], ...folder };
  } else {
    folders.push(folder);
  }
  await chrome.storage.local.set({ [KEYS.FOLDERS]: folders });
  return folders;
}

export async function removeFolder(folderId) {
  const folders = await getFolders();
  // Bug 1 fix: keep locked (system) folders unconditionally; only remove the
  // specific target folder.  The old condition `f.id !== folderId && !f.locked`
  // accidentally deleted every locked folder (e.g. "Vsa vozila") on each call.
  const filtered = folders.filter(
    (f) => f.locked || f.id !== folderId
  );
  await chrome.storage.local.set({ [KEYS.FOLDERS]: filtered });
  // Reassign orphaned vehicles to 'all'
  const vehicles = await getVehicles();
  const updated = vehicles.map((v) =>
    v.folderId === folderId ? { ...v, folderId: 'all' } : v
  );
  await chrome.storage.local.set({ [KEYS.VEHICLES]: updated });
  return filtered;
}

// ─── Notifications ───────────────────────────────────────────────────────────

export async function getNotifications() {
  const r = await chrome.storage.local.get(KEYS.NOTIFICATIONS);
  return r[KEYS.NOTIFICATIONS] ?? [];
}

export async function addNotification(notification) {
  const notifications = await getNotifications();
  const entry = {
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    read: false,
    createdAt: Date.now(),
    ...notification,
  };
  const trimmed = [entry, ...notifications].slice(0, 100);
  await chrome.storage.local.set({ [KEYS.NOTIFICATIONS]: trimmed });
  return trimmed;
}

export async function markAllNotificationsRead() {
  const notifications = await getNotifications();
  const updated = notifications.map((n) => ({ ...n, read: true }));
  await chrome.storage.local.set({ [KEYS.NOTIFICATIONS]: updated });
  return updated;
}

export async function clearNotifications() {
  await chrome.storage.local.set({ [KEYS.NOTIFICATIONS]: [] });
  return [];
}

export async function exportData() {
  const [vehicles, folders, settings, notifications] = await Promise.all([
    getVehicles(),
    getFolders(),
    getSettings(),
    getNotifications(),
  ]);
  return {
    exportedAt: new Date().toISOString(),
    version: 1,
    vehicles,
    folders,
    settings,
    notifications,
  };
}

export async function clearAllData() {
  await chrome.storage.local.set({
    [KEYS.VEHICLES]: [],
    [KEYS.FOLDERS]: DEFAULT_FOLDERS,
    [KEYS.NOTIFICATIONS]: [],
    [KEYS.SETTINGS]: DEFAULT_SETTINGS,
  });
  return {
    vehicles: [],
    folders: DEFAULT_FOLDERS,
    notifications: [],
    settings: DEFAULT_SETTINGS,
  };
}

// ─── Settings ────────────────────────────────────────────────────────────────

export async function getSettings() {
  const r = await chrome.storage.local.get(KEYS.SETTINGS);
  return { ...DEFAULT_SETTINGS, ...(r[KEYS.SETTINGS] ?? {}) };
}

export async function saveSettings(patch) {
  const current = await getSettings();
  const merged = { ...current, ...patch };
  await chrome.storage.local.set({ [KEYS.SETTINGS]: merged });
  return merged;
}

function normalizeVehicle(vehicle) {
  return {
    ...vehicle,
    images: Array.isArray(vehicle.images) ? vehicle.images.slice(0, 12) : [],
    description:
      typeof vehicle.description === 'string'
        ? vehicle.description.slice(0, 3000)
        : vehicle.description,
    priceHistory: Array.isArray(vehicle.priceHistory)
      ? vehicle.priceHistory.slice(-MAX_PRICE_HISTORY)
      : [],
  };
}
