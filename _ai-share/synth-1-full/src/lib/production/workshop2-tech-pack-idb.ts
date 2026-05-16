/**
 * IndexedDB для байтов вложений техпака, если не влезают в data URL (localStorage).
 * Ключ: collectionId::articleId::attachmentId
 */
const DB_NAME = 'synth.brand.w2techpack.blobs.v1';
const DB_VERSION = 1;
const STORE = 'blobs';

function safeId(s: string): string {
  return s.replace(/:/g, '_');
}

function makeKey(collectionId: string, articleId: string, attachmentId: string): string {
  return `${safeId(collectionId)}::${safeId(articleId)}::${safeId(attachmentId)}`;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open(DB_NAME, DB_VERSION);
    r.onerror = () => reject(r.error ?? new Error('idb open'));
    r.onsuccess = () => resolve(r.result);
    r.onupgradeneeded = () => {
      const db = r.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
  });
}

export async function putW2TechPackBlob(
  collectionId: string,
  articleId: string,
  attachmentId: string,
  blob: Blob
): Promise<void> {
  const db = await openDb();
  const k = makeKey(collectionId, articleId, attachmentId);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('idb tx'));
    tx.objectStore(STORE).put(blob, k);
  });
}

export async function getW2TechPackBlob(
  collectionId: string,
  articleId: string,
  attachmentId: string
): Promise<Blob | undefined> {
  const db = await openDb();
  const k = makeKey(collectionId, articleId, attachmentId);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const q = tx.objectStore(STORE).get(k);
    q.onsuccess = () => resolve(q.result as Blob | undefined);
    q.onerror = () => reject(q.error ?? new Error('idb get'));
  });
}

export async function deleteW2TechPackBlob(
  collectionId: string,
  articleId: string,
  attachmentId: string
): Promise<void> {
  const db = await openDb();
  const k = makeKey(collectionId, articleId, attachmentId);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('idb del'));
    tx.objectStore(STORE).delete(k);
  });
}
