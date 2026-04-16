import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { MedicamentoService } from '../../core/services/medicamento';
import { VentaService, Venta } from '../../core/services/venta';
import { Indexeddb } from '../../core/services/indexeddb';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  totalMedicamentos = 0;
  stockBajo: any[] = [];
  ventasHoy = 0;
  totalHoy = 0;
  ventasRecientes: Venta[] = [];

  private routerSub!: Subscription;

  constructor(
    private medService: MedicamentoService,
    private ventaService: VentaService,
    private idb: Indexeddb,
    private router: Router
  ) {}

  async ngOnInit() {
    // Espera que la DB esté lista ANTES de consultar
    await this.idb.getDB();
    await this.cargarDatos();

    // Recarga cada vez que el usuario navega de vuelta al dashboard
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.cargarDatos();
      });
  }

  ngOnDestroy() {
    if (this.routerSub) this.routerSub.unsubscribe();
  }

  async cargarDatos() {
    try {
      // --- Medicamentos ---
      const meds = await this.medService.listar();
      this.totalMedicamentos = meds.length;
      this.stockBajo = meds.filter(m => m.stock <= 5);

      // --- Ventas ---
      const hoy = new Date().toISOString().split('T')[0];
      const ventas = await this.ventaService.listar();

      const ventasDeHoy = ventas.filter(v => v.fecha.startsWith(hoy));
      this.ventasHoy = ventasDeHoy.length;
      this.totalHoy = ventasDeHoy.reduce((acc, v) => acc + v.total, 0);

      // Últimas 5 ventas (las más recientes primero)
      this.ventasRecientes = [...ventas]
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 5);

    } catch (err) {
      console.error('Error cargando datos del dashboard:', err);
    }
  }
}