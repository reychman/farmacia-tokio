import { Injectable } from '@angular/core';
import { IndexeddbService } from './indexeddb';

export interface Medicamento {
  id?: number;
  nombre: string;
  laboratorio: string;
  precio: number;
  stock: number;
  unidad: string;
  descripcion: string;
  fechaVencimiento: string;
}

@Injectable({ providedIn: 'root' })
export class MedicamentoService {
  private readonly STORE = 'medicamentos';

  constructor(private idb: IndexeddbService) {}

  agregar(med: Medicamento): Promise<number> {
    return this.idb.add(this.STORE, med);
  }

  listar(): Promise<Medicamento[]> {
    return this.idb.getAll(this.STORE);
  }

  obtener(id: number): Promise<Medicamento> {
    return this.idb.getById(this.STORE, id);
  }

  actualizar(med: Medicamento): Promise<void> {
    return this.idb.put(this.STORE, med);
  }

  eliminar(id: number): Promise<void> {
    return this.idb.delete(this.STORE, id);
  }
}