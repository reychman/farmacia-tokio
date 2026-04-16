import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VentaService, Venta } from '../../../core/services/venta';

@Component({
  selector: 'app-venta-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './venta-list.html',
})
export class VentaListComponent implements OnInit {
  ventas: Venta[] = [];

  constructor(private ventaService: VentaService) {}

  async ngOnInit() {
    this.ventas = (await this.ventaService.listar()).reverse();
  }

  async eliminar(id: number) {
    if (!confirm('¿Anular esta venta? El stock NO se restaurará automáticamente.')) return;
    await this.ventaService.eliminar(id);
    this.ventas = (await this.ventaService.listar()).reverse();
  }

  formatFecha(iso: string) {
    return new Date(iso).toLocaleString('es-BO');
  }
}