import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Indexeddb {
  private db!: IDBDatabase;
  private readonly DB_NAME = 'farmaciaTokenDB';
  private readonly DB_VERSION = 1;

  initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      req.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;

        // --- Object Store: medicamentos ---
        if (!db.objectStoreNames.contains('medicamentos')) {
          const meds = db.createObjectStore('medicamentos', {
            keyPath: 'id',
            autoIncrement: true,
          });
          meds.createIndex('nombre', 'nombre', { unique: false });
          meds.createIndex('laboratorio', 'laboratorio', { unique: false });
        }

        // --- Object Store: ventas ---
        if (!db.objectStoreNames.contains('ventas')) {
          db.createObjectStore('ventas', {
            keyPath: 'id',
            autoIncrement: true,
          });
        }

        // --- Object Store: detalleVentas ---
        if (!db.objectStoreNames.contains('detalleVentas')) {
          const det = db.createObjectStore('detalleVentas', {
            keyPath: 'id',
            autoIncrement: true,
          });
          det.createIndex('ventaId', 'ventaId', { unique: false });
        }
      };

      req.onsuccess = (e) => {
        this.db = (e.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      req.onerror = () => reject(req.error);
    });
  }

  getDB(): Promise<IDBDatabase> {
    if (this.db) return Promise.resolve(this.db);
    return this.initDB();
  }

  // ---------- MÉTODOS GENÉRICOS ----------

  add(store: string, data: any): Promise<number> {
    return new Promise(async (resolve, reject) => {
      const db = await this.getDB();
      const tx = db.transaction(store, 'readwrite');
      const req = tx.objectStore(store).add(data);
      req.onsuccess = () => resolve(req.result as number);
      req.onerror = () => reject(req.error);
    });
  }

  getAll(store: string): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      const db = await this.getDB();
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  getById(store: string, id: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const db = await this.getDB();
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  put(store: string, data: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const db = await this.getDB();
      const tx = db.transaction(store, 'readwrite');
      const req = tx.objectStore(store).put(data);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  delete(store: string, id: number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const db = await this.getDB();
      const tx = db.transaction(store, 'readwrite');
      const req = tx.objectStore(store).delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  getByIndex(store: string, indexName: string, value: any): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      const db = await this.getDB();
      const tx = db.transaction(store, 'readonly');
      const idx = tx.objectStore(store).index(indexName);
      const req = idx.getAll(value);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  // ---------- MÉTODO ESPECIAL: guardar venta completa (transacción atómica) ----------

  guardarVentaCompleta(
    venta: { fecha: string; total: number; metodoPago: string; observacion: string },
    items: { medicamentoId: number; cantidad: number; precioUnitario: number }[]
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      const db = await this.getDB();
      const tx = db.transaction(
        ['ventas', 'detalleVentas', 'medicamentos'],
        'readwrite'
      );

      const ventaReq = tx.objectStore('ventas').add(venta);

      ventaReq.onsuccess = () => {
        const ventaId = ventaReq.result as number;

        items.forEach((item) => {
          tx.objectStore('detalleVentas').add({
            ventaId,
            medicamentoId: item.medicamentoId,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            subtotal: item.cantidad * item.precioUnitario,
          });

          const medStore = tx.objectStore('medicamentos');
          const getReq = medStore.get(item.medicamentoId);
          getReq.onsuccess = () => {
            const med = getReq.result;
            if (med) {
              med.stock -= item.cantidad;
              medStore.put(med);
            }
          };
        });

        tx.oncomplete = () => resolve(ventaId);
      };

      tx.onerror = () => reject(tx.error);
    });
  }
}