import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MedicamentoService } from '../../core/services/medicamento';
import { VentaService } from '../../core/services/venta';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  totalMedicamentos = 0;
  stockBajo: any[] = [];
  ventasHoy = 0;
  totalHoy = 0;

  constructor(
    private medService: MedicamentoService,
    private ventaService: VentaService
  ) {}

  async ngOnInit() {
    const meds = await this.medService.listar();
    this.totalMedicamentos = meds.length;
    this.stockBajo = meds.filter(m => m.stock <= 5);

    const hoy = new Date().toISOString().split('T')[0];
    const ventas = await this.ventaService.listar();
    const ventasDeHoy = ventas.filter(v => v.fecha.startsWith(hoy));
    this.ventasHoy = ventasDeHoy.length;
    this.totalHoy = ventasDeHoy.reduce((acc, v) => acc + v.total, 0);
  }
}