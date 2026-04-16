import { Injectable } from '@angular/core';
import { Indexeddb } from './indexeddb';

export interface Venta {
  id?: number;
  fecha: string;
  total: number;
  metodoPago: string;
  observacion: string;
}

export interface DetalleVenta {
  id?: number;
  ventaId: number;
  medicamentoId: number;
  nombreMedicamento?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface ItemCarrito {
  medicamentoId: number;
  nombreMedicamento: string;
  cantidad: number;
  precioUnitario: number;
}

@Injectable({ providedIn: 'root' })
export class VentaService {
  constructor(private idb: Indexeddb) {}

  registrar(
    venta: Venta,
    items: ItemCarrito[]
  ): Promise<number> {
    return this.idb.guardarVentaCompleta(venta, items);
  }

  listar(): Promise<Venta[]> {
    return this.idb.getAll('ventas');
  }

  obtener(id: number): Promise<Venta> {
    return this.idb.getById('ventas', id);
  }

  async obtenerDetalle(ventaId: number): Promise<DetalleVenta[]> {
    const detalles = await this.idb.getAll('detalleVentas');
    return detalles.filter((detalle: DetalleVenta) => detalle.ventaId === ventaId);
  }

  eliminar(id: number): Promise<void> {
    return this.idb.delete('ventas', id);
  }
}