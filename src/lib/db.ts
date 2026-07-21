import { createDefaultState } from "../data/defaults";
import type { AppState, LiftLogExport } from "../types";

const DB_NAME = "liftlog";
const STORE = "app-state";
const STATE_KEY = "current";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) {
        request.result.createObjectStore(STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>) {
  const database = await openDatabase();
  return new Promise<T>((resolve, reject) => {
    const transaction = database.transaction(STORE, mode);
    const request = action(transaction.objectStore(STORE));
    let result: T;
    request.onsuccess = () => {
      result = request.result;
    };
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => {
      database.close();
      resolve(result);
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error);
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
  });
}

let pendingSave: Promise<void> = Promise.resolve();

export async function loadState(): Promise<AppState> {
  const stored = await withStore<AppState | undefined>("readonly", (store) => store.get(STATE_KEY));
  if (stored) return stored;
  const initial = createDefaultState();
  await saveState(initial);
  return initial;
}

export async function saveState(state: AppState): Promise<void> {
  const save = pendingSave.then(() =>
    withStore<IDBValidKey>("readwrite", (store) => store.put(state, STATE_KEY)).then(() => undefined),
  );
  pendingSave = save.catch(() => undefined);
  return save;
}

export function serializeState(state: AppState): string {
  const payload: LiftLogExport = {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    ...state,
  };
  return JSON.stringify(payload, null, 2);
}

export function parseImport(json: string): AppState {
  const candidate: unknown = JSON.parse(json);
  if (!candidate || typeof candidate !== "object") throw new Error("That file is not a LiftLog backup.");
  const payload = candidate as Partial<LiftLogExport>;
  if (payload.schemaVersion !== 1) throw new Error("This backup version is not supported.");
  if (!Array.isArray(payload.templates) || !Array.isArray(payload.workouts)) {
    throw new Error("That backup is missing workout data.");
  }
  if (!payload.settings || typeof payload.settings.restSeconds !== "number") {
    throw new Error("That backup has invalid settings.");
  }
  return {
    templates: payload.templates,
    workouts: payload.workouts,
    settings: payload.settings,
  };
}
