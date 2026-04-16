import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicamentoService, Medicamento } from '../../../core/services/medicamento';
import { VentaService, ItemCarrito } from '../../../core/services/venta';

@Component({
  selector: 'app-venta-nueva',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './venta-nueva.html',
})
export class VentaNuevaComponent implements OnInit {
  medicamentos: Medicamento[] = [];
  busqueda = '';
  carrito: ItemCarrito[] = [];
  metodoPago = 'efectivo';
  observacion = '';
  guardando = false;

  constructor(
    private medService: MedicamentoService,
    private ventaService: VentaService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.medicamentos = await this.medService.listar();
  }

  get medicamentosFiltrados() {
    if (!this.busqueda.trim()) return this.medicamentos;
    const q = this.busqueda.toLowerCase();
    return this.medicamentos.filter(m =>
      m.nombre.toLowerCase().includes(q)
    );
  }

  agregarAlCarrito(med: Medicamento) {
    const existe = this.carrito.find(i => i.medicamentoId === med.id);
    if (existe) {
      if (existe.cantidad < med.stock) existe.cantidad++;
      else alert('No hay más stock disponible');
      return;
    }
    if (med.stock === 0) { alert('Sin stock'); return; }
    this.carrito.push({
      medicamentoId: med.id!,
      nombreMedicamento: med.nombre,
      cantidad: 1,
      precioUnitario: med.precio,
    });
    this.busqueda = '';
  }

  quitarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
  }

  cambiarCantidad(item: ItemCarrito, delta: number) {
    const med = this.medicamentos.find(m => m.id === item.medicamentoId);
    const nueva = item.cantidad + delta;
    if (nueva < 1) { this.quitarDelCarrito(this.carrito.indexOf(item)); return; }
    if (med && nueva > med.stock) { alert('Stock insuficiente'); return; }
    item.cantidad = nueva;
  }

  get total() {
    return this.carrito.reduce((a, i) => a + i.cantidad * i.precioUnitario, 0);
  }

  async confirmarVenta() {
    if (this.carrito.length === 0) { alert('El carrito está vacío'); return; }
    this.guardando = true;
    const venta = {
      fecha: new Date().toISOString(),
      total: this.total,
      metodoPago: this.metodoPago,
      observacion: this.observacion,
    };
    await this.ventaService.registrar(venta, this.carrito);
    this.guardando = false;
    alert('Venta registrada correctamente');
    this.router.navigate(['/ventas']);
  }
}