
import { User } from '../frontend/types';

const DB_NAME = 'ATS_STORAGE_V2';
const DB_VERSION = 1;

export class DatabaseService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (this.db) return;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('user')) {
          db.createObjectStore('user', { keyPath: 'id' });
        }
      };
    });
  }

  async saveUser(user: User): Promise<void> {
    await this.init();
    const transaction = this.db!.transaction(['user'], 'readwrite');
    transaction.objectStore('user').put(user);
  }

  async getUser(id: string): Promise<User | null> {
    await this.init();
    return new Promise((resolve) => {
      const request = this.db!.transaction(['user'], 'readonly').objectStore('user').get(id);
      request.onsuccess = () => resolve(request.result || null);
    });
  }
}

export const dbService = new DatabaseService();
