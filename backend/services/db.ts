import { FileData, AtsAnalysisResult, User } from '../../frontend/types';

const DB_NAME = 'ATSMasterDB';
const DB_VERSION = 1;

export interface HistoryItem {
  id: string;
  timestamp: number;
  fileName: string;
  score: number;
  result: AtsAnalysisResult;
  optimizedHtml?: string;
}

export class DatabaseService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('history')) {
          db.createObjectStore('history', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('user')) {
          db.createObjectStore('user', { keyPath: 'id' });
        }
      };
    });
  }

  async saveHistory(item: HistoryItem): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['history'], 'readwrite');
      const store = transaction.objectStore('history');
      store.put(item);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getHistory(): Promise<HistoryItem[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['history'], 'readonly');
      const store = transaction.objectStore('history');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result.sort((a: any, b: any) => b.timestamp - a.timestamp));
      request.onerror = () => reject(request.error);
    });
  }

  async saveUser(user: User): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['user'], 'readwrite');
      const store = transaction.objectStore('user');
      store.put(user);
      transaction.oncomplete = () => resolve();
    });
  }

  async getUser(id: string): Promise<User | null> {
    if (!this.db) await this.init();
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['user'], 'readonly');
      const store = transaction.objectStore('user');
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
    });
  }
}

export const dbService = new DatabaseService();



