import { LEVEL_COUNT } from "./constants";

const KEY = "pixel-break-v1";
const IDB_NAME = "pixel-break";
const VERSION = 2;

export type SaveData = {
  version: number;
  highScore: number;
  unlocked: number;
  bestCombo: number;
  lastLevel: number;
  sfx: boolean;
  music: boolean;
  shake: boolean;
};

const DEFAULTS: SaveData = {
  version: VERSION,
  highScore: 0,
  unlocked: 1,
  bestCombo: 0,
  lastLevel: 0,
  sfx: true,
  music: true,
  shake: true,
};

export function mergeSaves(...parts: Array<Partial<SaveData> | null | undefined>): SaveData {
  const out: SaveData = { ...DEFAULTS };
  for (const p of parts) {
    if (!p) continue;
    if (typeof p.highScore === "number") out.highScore = Math.max(out.highScore, p.highScore | 0);
    if (typeof p.unlocked === "number") out.unlocked = Math.max(out.unlocked, p.unlocked | 0);
    if (typeof p.bestCombo === "number") out.bestCombo = Math.max(out.bestCombo, p.bestCombo | 0);
    if (typeof p.lastLevel === "number") out.lastLevel = Math.max(out.lastLevel, p.lastLevel | 0);
    if (typeof p.sfx === "boolean") out.sfx = p.sfx;
    if (typeof p.music === "boolean") out.music = p.music;
    if (typeof p.shake === "boolean") out.shake = p.shake;
  }
  out.unlocked = Math.max(1, Math.min(LEVEL_COUNT, out.unlocked));
  out.lastLevel = Math.max(0, Math.min(LEVEL_COUNT - 1, out.lastLevel));
  out.version = VERSION;
  return out;
}

function migrate(raw: Partial<SaveData>): SaveData {
  return mergeSaves(raw);
}

function readLocal(): SaveData | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return migrate(JSON.parse(raw) as Partial<SaveData>);
  } catch {
    return null;
  }
}

function readCookie(): SaveData | null {
  try {
    const m = document.cookie.match(/(?:^|; )pb_save=([^;]*)/);
    if (!m?.[1]) return null;
    return migrate(JSON.parse(decodeURIComponent(m[1])) as Partial<SaveData>);
  } catch {
    return null;
  }
}

export function loadSave(): SaveData {
  if (typeof window === "undefined") return { ...DEFAULTS };
  return mergeSaves(readLocal(), readCookie());
}

export function writeSave(data: SaveData) {
  const next = mergeSaves(data);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode / quota */
  }
  try {
    const compact = encodeURIComponent(
      JSON.stringify({
        highScore: next.highScore,
        unlocked: next.unlocked,
        lastLevel: next.lastLevel,
        bestCombo: next.bestCombo,
        sfx: next.sfx,
        music: next.music,
        shake: next.shake,
      }),
    );
    document.cookie = `pb_save=${compact};max-age=31536000;path=/;SameSite=Lax`;
  } catch {
    /* cookie blocked */
  }
  void writeIdb(next);
}

function writeIdb(data: SaveData) {
  if (typeof indexedDB === "undefined") return;
  try {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains("s")) req.result.createObjectStore("s");
    };
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction("s", "readwrite");
      tx.objectStore("s").put(data, "save");
      tx.oncomplete = () => db.close();
    };
  } catch {
    /* ignore */
  }
}

export function loadIdb(): Promise<SaveData | null> {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onerror = () => resolve(null);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains("s")) req.result.createObjectStore("s");
      };
      req.onsuccess = () => {
        const db = req.result;
        try {
          const tx = db.transaction("s", "readonly");
          const get = tx.objectStore("s").get("save");
          get.onsuccess = () => {
            db.close();
            resolve(get.result ? migrate(get.result as Partial<SaveData>) : null);
          };
          get.onerror = () => {
            db.close();
            resolve(null);
          };
        } catch {
          db.close();
          resolve(null);
        }
      };
    } catch {
      resolve(null);
    }
  });
}
